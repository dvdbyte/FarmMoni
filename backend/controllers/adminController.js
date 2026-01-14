const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Investment = require('../models/Investment');
const Project = require('../models/Project');
const Wallet = require('../models/Wallet');

// Get Admin Dashboard Stats
exports.getAdminStats = async (req, res) => {
  try {
    // 1. Get Counts
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalInvestments = await Investment.countDocuments({ status: 'active' });

    // 2. Calculate Total Volume (Sum of all completed investments)
    const volumeResult = await Investment.aggregate([
      { $match: { status: { $ne: 'cancelled' } } }, // Include active & completed
      { $group: { _id: null, total: { $sum: "$amountInvested" } } }
    ]);
    const totalVolume = volumeResult[0] ? volumeResult[0].total : 0;

    // 3. Get Pending Withdrawals
    const pendingWithdrawals = await Transaction.find({ type: 'withdrawal', status: 'pending' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5); // Only show top 5 on dashboard

    // 4. Get Recent Activity (Last 5 transactions of any kind)
    const recentActivity = await Transaction.find({})
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalUsers,
      totalInvestments,
      totalVolume,
      pendingWithdrawals,
      recentActivity
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all users (with their wallet balance)
exports.getAllUsers = async (req, res) => {
  try {
    // 1. Fetch all users (exclude password)
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });

    // 2. Fetch wallet balances for these users
    const usersWithWallet = await Promise.all(
      users.map(async (user) => {
        const wallet = await Wallet.findOne({ user: user._id });
        return {
          ...user._doc, // Spread user properties
          walletBalance: wallet ? wallet.balance : 0
        };
      })
    );

    res.json(usersWithWallet);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all investments 
exports.getAllInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({})
      .populate('user', 'name email') // Get investor name
      .populate('project', 'title image') // Get farm title
      .sort({ createdAt: -1 }); // Newest first

    res.json(investments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// Get all withdrawal requests
exports.getWithdrawals = async (req, res) => {
  try {
    const withdrawals = await Transaction.find({ type: 'withdrawal' })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    
    res.json(withdrawals);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

// Approve a withdrawal (Mark as paid)
exports.approveWithdrawal = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });

    tx.status = 'success';
    await tx.save();

    res.json({ message: 'Withdrawal approved', tx });
  } catch (error) {
    res.status(500).json({ message: 'Approval failed' });
  }
};

// Reject a withdrawal (Refund money to wallet)
exports.rejectWithdrawal = async (req, res) => {
  try {
    const tx = await Transaction.findById(req.params.id);

    if (!tx) return res.status(404).json({ message: 'Transaction not found' });
    if (tx.status !== 'pending') return res.status(400).json({ message: 'Transaction already processed' });

    // 1. Mark transaction as failed
    tx.status = 'failed';
    await tx.save();

    // 2. REFUND the money back to user wallet
    const wallet = await Wallet.findOne({ user: tx.user });
    if (wallet) {
      wallet.balance += tx.amount;
      await wallet.save();
      
      // 3. Create a "Refund" transaction record so user knows why balance went up
      await Transaction.create({
        user: tx.user,
        type: 'deposit', // Treat as deposit/refund
        amount: tx.amount,
        description: `Refund: Withdrawal Rejected (${tx.reference})`,
        status: 'success',
        reference: `REF-${Date.now()}`
      });
    }

    res.json({ message: 'Withdrawal rejected and refunded', tx });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Rejection failed' });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      // Optional: Delete their wallet too to keep DB clean
      await Wallet.deleteOne({ user: req.params.id });
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};

exports.payInvestmentReturn = async (req, res) => {
  try {
    // 1. Find the investment
    const investment = await Investment.findById(req.params.id).populate('user');
    
    if (!investment) {
      return res.status(404).json({ message: 'Investment not found' });
    }

    if (investment.status === 'completed') {
      return res.status(400).json({ message: 'Investment already paid out' });
    }

    // 2. Find User's Wallet
    const wallet = await Wallet.findOne({ user: investment.user._id });
    if (!wallet) {
      return res.status(404).json({ message: 'User wallet not found' });
    }

    // 3. Credit the Wallet (Principal + Profit)
    const payoutAmount = investment.expectedReturn;
    wallet.balance += payoutAmount;
    await wallet.save();

    // 4. Create Transaction Record
    await Transaction.create({
      user: investment.user._id,
      amount: payoutAmount,
      type: 'deposit', // It adds money
      status: 'success',
      reference: `ROI-${Date.now()}`,
      description: `ROI Payout: ${investment.project ? investment.project.title : 'Farm Investment'}`
    });

    // 5. Mark Investment as Completed
    investment.status = 'completed';
    await investment.save();

    res.json({ message: 'ROI paid successfully', investment });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Payout failed' });
  }
};