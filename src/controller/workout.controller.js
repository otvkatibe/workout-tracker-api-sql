import { validate as isUUID } from 'uuid';
import * as workoutService from '../services/workout.service.js';

const validateRequiredFields = (fields, body) => {
    const missingFields = fields.filter((field) => !body[field]);
    if (missingFields.length > 0) {
        return `Os seguintes campos são obrigatórios: ${missingFields.join(', ')}`;
    }
    return null;
};

const validateRequestBody = (body) => {
    const allowedFields = ['name', 'description', 'duration', 'date'];
    const invalidFields = Object.keys(body).filter((field) => !allowedFields.includes(field));

    if (invalidFields.length > 0) {
        return `Os seguintes campos não são permitidos: ${invalidFields.join(', ')}`;
    }

    if (body.name && typeof body.name !== 'string') {
        return 'O campo "name" deve ser uma string.';
    }
    if (body.description && typeof body.description !== 'string') {
        return 'O campo "description" deve ser uma string.';
    }
    if (body.duration && (typeof body.duration !== 'number' || body.duration <= 0)) {
        return 'O campo "duration" deve ser um número inteiro maior que 0.';
    }
    if (body.date && isNaN(Date.parse(body.date))) {
        return 'O campo "date" deve ser uma data válida.';
    }

    return null;
};

export const createWorkout = async (req, res) => {
    const { id: userId } = req.user; // Mover para fora do bloco try
    try {
        const requiredFields = ['name', 'duration', 'date'];
        const validationError = validateRequiredFields(requiredFields, req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const formatError = validateRequestBody(req.body);
        if (formatError) {
            return res.status(400).json({ message: formatError });
        }

        const workout = await workoutService.createWorkout({ ...req.body, userId });
        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts - Treino criado com sucesso.`
        );
        res.status(201).json(workout);
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts - Erro: ${error.message}`
        );
        res.status(500).json({ message: 'Erro interno ao criar treino.' });
    }
};

export const getWorkouts = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const workouts = await workoutService.getWorkoutsByUser(userId);
        res.status(200).json(workouts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao listar treinos.' });
    }
};

export const getWorkout = async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const workout = await workoutService.getWorkoutById(id, userId);
        if (!workout) {
            return res
                .status(404)
                .json({ message: 'Treino não encontrado ou não pertence ao usuário.' });
        }

        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${id} - Treino recuperado com sucesso.`
        );
        res.status(200).json(workout);
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${id} - Erro: ${error.message}`
        );
        res.status(500).json({ message: 'Erro interno ao buscar treino.' });
    }
};

export const updateWorkout = async (req, res) => {
    try {
        const requiredFields = ['name', 'duration', 'date'];
        const validationError = validateRequiredFields(requiredFields, req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const formatError = validateRequestBody(req.body);
        if (formatError) {
            return res.status(400).json({ message: formatError });
        }

        const { id: userId } = req.user;
        const { id } = req.params;
        const workout = await workoutService.updateWorkout(id, userId, req.body);
        if (!workout) {
            return res.status(404).json({ message: 'Treino não encontrado.' });
        }
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar treino.' });
    }
};

/*export const patchWorkout = async (req, res) => {
    try {
        const formatError = validateRequestBody(req.body);
        if (formatError) {
            return res.status(400).json({ message: formatError });
        }

        const { id: userId } = req.user;
        const { id } = req.params;
        const workout = await workoutService.updateWorkout(id, userId, req.body);
        if (!workout) return res.status(404).json({ message: 'Treino não encontrado.' });
        res.status(200).json(workout);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar treino parcialmente.' });
    }
};*/

export const deleteWorkout = async (req, res) => {
    const { id: userId } = req.user;
    const { id } = req.params;
    try {
        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const workout = await workoutService.getWorkoutById(id, userId);
        if (!workout) {
            return res
                .status(404)
                .json({ message: 'Treino não encontrado ou não pertence ao usuário.' });
        }

        await workoutService.deleteWorkout(id, userId);
        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${id} - Treino removido com sucesso.`
        );
        res.status(200).json({ message: 'Treino removido com sucesso.' });
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${id} - Erro: ${error.message}`
        );
        res.status(500).json({ message: 'Erro interno ao remover treino.' });
    }
};
