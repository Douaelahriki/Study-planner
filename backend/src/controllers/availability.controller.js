const User = require('../models/User');

/**
 * Convertir HH:MM en minutes (pour comparaisons)
 */
const timeToMinutes = (time) => {
  const [hours, minutes] = time.split(':').map(Number);
  return hours * 60 + minutes;
};

/**
 * Vérifier si 2 créneaux se chevauchent
 */
const hasOverlap = (slot1, slot2) => {
  if (slot1.day !== slot2.day) return false;
  const start1 = timeToMinutes(slot1.startTime);
  const end1 = timeToMinutes(slot1.endTime);
  const start2 = timeToMinutes(slot2.startTime);
  const end2 = timeToMinutes(slot2.endTime);
  return start1 < end2 && start2 < end1;
};

/**
 * @desc    Récupérer les disponibilités de l'utilisateur connecté
 * @route   GET /api/availability
 * @access  Private
 */
const getMyAvailability = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur non trouvé'
      });
    }

    res.json({
      success: true,
      count: user.availability.length,
      availability: user.availability
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Ajouter un créneau de disponibilité
 * @route   POST /api/availability
 * @access  Private
 */
const addAvailability = async (req, res, next) => {
  try {
    const { day, startTime, endTime } = req.body;

    // Validation
    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires (day, startTime, endTime)'
      });
    }

    // Vérifier le format HH:MM
    const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return res.status(400).json({
        success: false,
        message: 'Format d\'heure invalide. Utilisez HH:MM (ex: 14:30)'
      });
    }

    // Vérifier que endTime > startTime
    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'L\'heure de fin doit être après l\'heure de début'
      });
    }

    // Vérifier que le jour est valide
    const validDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    if (!validDays.includes(day)) {
      return res.status(400).json({
        success: false,
        message: 'Jour invalide'
      });
    }

    const user = await User.findById(req.user._id);
    
    // Vérifier qu'il n'y a pas de chevauchement
    const newSlot = { day, startTime, endTime };
    const overlap = user.availability.find(slot => hasOverlap(slot, newSlot));
    
    if (overlap) {
      return res.status(400).json({
        success: false,
        message: `Ce créneau chevauche un créneau existant (${overlap.startTime} - ${overlap.endTime})`
      });
    }

    // Ajouter le créneau
    user.availability.push(newSlot);
    await user.save();

    res.status(201).json({
      success: true,
      message: 'Créneau ajouté',
      availability: user.availability
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Modifier un créneau (par index dans le tableau)
 * @route   PUT /api/availability/:index
 * @access  Private
 */
const updateAvailability = async (req, res, next) => {
  try {
    const index = parseInt(req.params.index);
    const { day, startTime, endTime } = req.body;

    if (isNaN(index)) {
      return res.status(400).json({
        success: false,
        message: 'Index invalide'
      });
    }

    const user = await User.findById(req.user._id);

    if (index < 0 || index >= user.availability.length) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }

    // Validation
    if (!day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Tous les champs sont obligatoires'
      });
    }

    if (timeToMinutes(endTime) <= timeToMinutes(startTime)) {
      return res.status(400).json({
        success: false,
        message: 'L\'heure de fin doit être après l\'heure de début'
      });
    }

    // Vérifier les chevauchements (sauf avec lui-même)
    const newSlot = { day, startTime, endTime };
    const overlap = user.availability.find((slot, i) => 
      i !== index && hasOverlap(slot, newSlot)
    );

    if (overlap) {
      return res.status(400).json({
        success: false,
        message: `Chevauchement avec un créneau existant (${overlap.startTime} - ${overlap.endTime})`
      });
    }

    // Mettre à jour
    user.availability[index] = newSlot;
    await user.save();

    res.json({
      success: true,
      message: 'Créneau modifié',
      availability: user.availability
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Supprimer un créneau
 * @route   DELETE /api/availability/:index
 * @access  Private
 */
const deleteAvailability = async (req, res, next) => {
  try {
    const index = parseInt(req.params.index);

    if (isNaN(index)) {
      return res.status(400).json({
        success: false,
        message: 'Index invalide'
      });
    }

    const user = await User.findById(req.user._id);

    if (index < 0 || index >= user.availability.length) {
      return res.status(404).json({
        success: false,
        message: 'Créneau non trouvé'
      });
    }

    user.availability.splice(index, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Créneau supprimé',
      availability: user.availability
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Remplacer toutes les disponibilités (en bulk)
 * @route   PUT /api/availability
 * @access  Private
 */
const setAllAvailability = async (req, res, next) => {
  try {
    const { availability } = req.body;

    if (!Array.isArray(availability)) {
      return res.status(400).json({
        success: false,
        message: 'availability doit être un tableau'
      });
    }

    // Valider chaque créneau
    for (let i = 0; i < availability.length; i++) {
      const slot = availability[i];
      if (!slot.day || !slot.startTime || !slot.endTime) {
        return res.status(400).json({
          success: false,
          message: `Créneau ${i + 1} : champs manquants`
        });
      }
      if (timeToMinutes(slot.endTime) <= timeToMinutes(slot.startTime)) {
        return res.status(400).json({
          success: false,
          message: `Créneau ${i + 1} : heure fin doit être après début`
        });
      }
    }

    // Vérifier les chevauchements internes
    for (let i = 0; i < availability.length; i++) {
      for (let j = i + 1; j < availability.length; j++) {
        if (hasOverlap(availability[i], availability[j])) {
          return res.status(400).json({
            success: false,
            message: 'Des créneaux se chevauchent'
          });
        }
      }
    }

    const user = await User.findById(req.user._id);
    user.availability = availability;
    await user.save();

    res.json({
      success: true,
      message: 'Disponibilités mises à jour',
      availability: user.availability
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyAvailability,
  addAvailability,
  updateAvailability,
  deleteAvailability,
  setAllAvailability
};