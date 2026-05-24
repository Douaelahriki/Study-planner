const User = require('../models/User');
const Subject = require('../models/Subject');
const Session = require('../models/Session');

/**
 * @desc    Récupérer tous les utilisateurs
 * @route   GET /api/admin/users
 * @access  Admin only
 */
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Récupérer un utilisateur par ID
 * @route   GET /api/admin/users/:id
 * @access  Admin only
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Récupérer ses statistiques
    const subjectsCount = await Subject.countDocuments({ userId: user._id });
    const sessionsCount = await Session.countDocuments({ userId: user._id });
    const completedSessions = await Session.countDocuments({ 
      userId: user._id, 
      status: 'completed' 
    });

    res.json({
      success: true,
      user,
      stats: {
        subjectsCount,
        sessionsCount,
        completedSessions
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Créer un nouvel administrateur
 * @route   POST /api/admin/users
 * @access  Admin only
 */
const createAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe doit contenir au moins 6 caractères'
      });
    }

    // Vérifier si l'email existe déjà
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: 'Cet email est déjà utilisé'
      });
    }

    // Créer l'admin (le password sera hashé automatiquement)
    const newAdmin = await User.create({
      name,
      email,
      password,
      role: 'admin'  // ← FORCÉ à admin
    });

    res.status(201).json({
      success: true,
      message: 'Administrateur créé avec succès',
      user: {
        id: newAdmin._id,
        name: newAdmin.name,
        email: newAdmin.email,
        role: newAdmin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Supprimer un utilisateur
 * @route   DELETE /api/admin/users/:id
 * @access  Admin only
 */
const deleteUser = async (req, res, next) => {
  try {
    // Empêcher l'admin de se supprimer lui-même
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte'
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    // Supprimer l'utilisateur ET toutes ses données associées
    await Subject.deleteMany({ userId: user._id });
    await Session.deleteMany({ userId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Utilisateur et toutes ses données supprimés'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Statistiques globales de l'application
 * @route   GET /api/admin/stats
 * @access  Admin only
 */
const getGlobalStats = async (req, res, next) => {
  try {
    // Comptes utilisateurs
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: 'admin' });
    const totalRegularUsers = await User.countDocuments({ role: 'user' });
    
    // Comptes contenus
    const totalSubjects = await Subject.countDocuments();
    const totalSessions = await Session.countDocuments();
    
    // Sessions par statut
    const completedSessions = await Session.countDocuments({ status: 'completed' });
    const plannedSessions = await Session.countDocuments({ status: 'planned' });
    const missedSessions = await Session.countDocuments({ status: 'missed' });

    // Total d'heures étudiées
    const sessionsCompleted = await Session.find({ status: 'completed' });
    const totalMinutesStudied = sessionsCompleted.reduce(
      (total, session) => total + (session.actualDuration || session.duration), 
      0
    );
    const totalHoursStudied = Math.round(totalMinutesStudied / 60);

    // Utilisateurs récents (7 derniers jours)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newUsersLastWeek = await User.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          admins: totalAdmins,
          regularUsers: totalRegularUsers,
          newUsersLastWeek
        },
        content: {
          totalSubjects,
          totalSessions
        },
        sessions: {
          completed: completedSessions,
          planned: plannedSessions,
          missed: missedSessions
        },
        productivity: {
          totalHoursStudied,
          totalMinutesStudied
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Statistiques de productivité hebdomadaire (tous users)
 * @route   GET /api/admin/stats/weekly
 * @access  Admin only
 */
const getWeeklyProductivity = async (req, res, next) => {
  try {
    // Calculer le lundi de cette semaine
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const monday = new Date(today.setDate(diff));
    monday.setHours(0, 0, 0, 0);

    // Sunday end of week
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    sunday.setHours(23, 59, 59, 999);

    // Récupérer toutes les sessions de la semaine
    const sessions = await Session.find({
      date: { $gte: monday, $lte: sunday }
    });

    // Initialiser les stats par jour
    const days = ['lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.', 'dim.'];
    const weeklyStats = days.map((day, index) => {
      const dayDate = new Date(monday);
      dayDate.setDate(monday.getDate() + index);
      
      const daySessions = sessions.filter(s => {
        const sessionDate = new Date(s.date);
        return sessionDate.toDateString() === dayDate.toDateString();
      });

      const completed = daySessions.filter(s => s.status === 'completed').length;
      const total = daySessions.length;
      const completedMinutes = daySessions
        .filter(s => s.status === 'completed')
        .reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);

      return {
        day,
        date: dayDate.toISOString(),
        completed,
        total,
        hours: Math.round(completedMinutes / 60 * 10) / 10
      };
    });

    res.json({
      success: true,
      weekStart: monday.toISOString(),
      weekEnd: sunday.toISOString(),
      weeklyStats
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createAdmin,
  deleteUser,
  getGlobalStats,
  getWeeklyProductivity
};