import * as setService from '../services/set.service.js';
import { validate as isUUID } from 'uuid';

const validateSetData = (body, isCreate = false) => {
    if (isCreate) {
        if (!body.exerciseId) return 'O campo exerciseId é obrigatório.';
        if (!body.reps || body.reps < 1) return 'O campo reps deve ser maior que 0.';
        if (body.weight === undefined || body.weight < 0) return 'O campo weight é obrigatório e deve ser >= 0.';
    }

    if (body.reps !== undefined && (body.reps < 1 || !Number.isInteger(body.reps))) {
        return 'O campo reps deve ser um inteiro maior que 0.';
    }
    if (body.weight !== undefined && body.weight < 0) {
        return 'O campo weight deve ser >= 0.';
    }
    if (body.rpe !== undefined && (body.rpe < 1 || body.rpe > 10)) {
        return 'O campo rpe deve estar entre 1 e 10.';
    }

    return null;
};

export const listSets = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { workoutId } = req.params;

        if (!isUUID(workoutId)) {
            return res.status(400).json({ message: 'ID do treino inválido.' });
        }

        const sets = await setService.getSetsByWorkout(workoutId, userId);
        if (sets === null) {
            return res.status(404).json({ message: 'Treino não encontrado ou não pertence ao usuário.' });
        }

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${workoutId}/sets - ${sets.length} séries listadas.`);
        res.status(200).json(sets);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao listar séries: ${error.message}`);
        res.status(500).json({ message: 'Erro ao listar séries.' });
    }
};

export const getSet = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const set = await setService.getSetById(id, userId);
        if (!set) {
            return res.status(404).json({ message: 'Série não encontrada.' });
        }

        res.status(200).json(set);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao buscar série: ${error.message}`);
        res.status(500).json({ message: 'Erro ao buscar série.' });
    }
};

export const createSet = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { workoutId } = req.params;

        if (!isUUID(workoutId)) {
            return res.status(400).json({ message: 'ID do treino inválido.' });
        }

        const validationError = validateSetData(req.body, true);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const set = await setService.createSet(workoutId, userId, req.body);
        if (!set) {
            return res.status(404).json({ message: 'Treino ou exercício não encontrado.' });
        }

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${workoutId}/sets - Série criada.`);
        res.status(201).json(set);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao criar série: ${error.message}`);
        res.status(500).json({ message: 'Erro ao criar série.' });
    }
};

export const updateSet = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const validationError = validateSetData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const set = await setService.updateSet(id, userId, req.body);
        if (!set) {
            return res.status(404).json({ message: 'Série não encontrada ou não pertence ao usuário.' });
        }

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /sets/${id} - Série atualizada.`);
        res.status(200).json(set);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao atualizar série: ${error.message}`);
        res.status(500).json({ message: 'Erro ao atualizar série.' });
    }
};

export const deleteSet = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const set = await setService.deleteSet(id, userId);
        if (!set) {
            return res.status(404).json({ message: 'Série não encontrada ou não pertence ao usuário.' });
        }

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /sets/${id} - Série removida.`);
        res.status(200).json({ message: 'Série removida com sucesso.' });
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao remover série: ${error.message}`);
        res.status(500).json({ message: 'Erro ao remover série.' });
    }
};

export const bulkCreateSets = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { workoutId } = req.params;

        if (!isUUID(workoutId)) {
            return res.status(400).json({ message: 'ID do treino inválido.' });
        }

        if (!Array.isArray(req.body) || req.body.length === 0) {
            return res.status(400).json({ message: 'O corpo deve ser um array de séries.' });
        }

        for (const setData of req.body) {
            const validationError = validateSetData(setData, true);
            if (validationError) {
                return res.status(400).json({ message: validationError });
            }
        }

        const sets = await setService.bulkCreateSets(workoutId, userId, req.body);
        if (!sets) {
            return res.status(404).json({ message: 'Treino não encontrado.' });
        }

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /workouts/${workoutId}/sets/bulk - ${sets.length} séries criadas.`);
        res.status(201).json({
            message: `${sets.length} séries criadas com sucesso.`,
            sets
        });
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao criar séries em bulk: ${error.message}`);
        res.status(500).json({ message: 'Erro ao criar séries.' });
    }
};
