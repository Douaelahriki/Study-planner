const Subject = require('../models/Subject');
const Session = require('../models/Session');

/**
 * @desc    Récupérer toutes les matières de l'utilisateur connecté
 * @route   GET /api/subjects
 * @access  Private
 */
const getMySubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ userId: req.user._id })
      .sort({ priority: -1, createdAt: -1 });

    res.json({
      success: true,
      count: subjects.length,
      subjects
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Récupérer une matière par ID
 * @route   GET /api/subjects/:id
 * @access  Private
 */
const getSubjectById = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    res.json({
      success: true,
      subject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Créer une nouvelle matière
 * @route   POST /api/subjects
 * @access  Private
 */
const createSubject = async (req, res, next) => {
  try {
    const { name, description, priority, weeklyGoalHours, color, maxSessionDuration } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Le nom de la matière est obligatoire'
      });
    }

    const subject = await Subject.create({
      userId: req.user._id,
      name,
      description: description || '',
      priority: priority || 3,
      weeklyGoalHours: weeklyGoalHours || 5,
      color: color || '#3B82F6',
      maxSessionDuration: maxSessionDuration || 120
    });

    res.status(201).json({
      success: true,
      message: 'Matière créée avec succès',
      subject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Modifier une matière
 * @route   PUT /api/subjects/:id
 * @access  Private
 */
const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    const { name, description, priority, weeklyGoalHours, color, maxSessionDuration } = req.body;

    if (name !== undefined) subject.name = name;
    if (description !== undefined) subject.description = description;
    if (priority !== undefined) subject.priority = priority;
    if (weeklyGoalHours !== undefined) subject.weeklyGoalHours = weeklyGoalHours;
    if (color !== undefined) subject.color = color;
    if (maxSessionDuration !== undefined) subject.maxSessionDuration = maxSessionDuration;

    await subject.save();

    res.json({
      success: true,
      message: 'Matière mise à jour',
      subject
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Supprimer une matière
 * @route   DELETE /api/subjects/:id
 * @access  Private
 */
const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    // Supprimer aussi toutes les sessions liées à cette matière
    await Session.deleteMany({ subjectId: subject._id });
    await subject.deleteOne();

    res.json({
      success: true,
      message: 'Matière et sessions associées supprimées'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Récupérer les statistiques d'une matière
 * @route   GET /api/subjects/:id/stats
 * @access  Private
 */
const getSubjectStats = async (req, res, next) => {
  try {
    const subject = await Subject.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: 'Matière non trouvée'
      });
    }

    const totalSessions = await Session.countDocuments({ subjectId: subject._id });
    const completedSessions = await Session.countDocuments({ 
      subjectId: subject._id, 
      status: 'completed' 
    });

    const sessions = await Session.find({ subjectId: subject._id, status: 'completed' });
    const totalMinutes = sessions.reduce((sum, s) => sum + (s.actualDuration || s.duration), 0);
    const totalHours = Math.round(totalMinutes / 60 * 10) / 10;

    res.json({
      success: true,
      stats: {
        totalSessions,
        completedSessions,
        totalHours,
        weeklyGoal: subject.weeklyGoalHours,
        progress: subject.weeklyGoalHours > 0 
          ? Math.round((totalHours / subject.weeklyGoalHours) * 100) 
          : 0
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMySubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectStats
};