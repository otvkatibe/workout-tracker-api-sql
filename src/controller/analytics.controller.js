import * as analyticsService from '../services/analytics.service.js';
import { validate as isUUID } from 'uuid';

export const getProgression = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { exerciseId } = req.params;
        const { period } = req.query;

        if (!isUUID(exerciseId)) {
            return res.status(400).json({ message: 'ID do exercício inválido.' });
        }

        const periodDays = period ? parseInt(period) : 30;
        if (isNaN(periodDays) || periodDays < 1 || periodDays > 365) {
            return res.status(400).json({ message: 'Período deve ser entre 1 e 365 dias.' });
        }

        const data = await analyticsService.getProgressionByExercise(userId, exerciseId, periodDays);

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /analytics/progression/${exerciseId} - Progressão calculada.`);
        res.status(200).json(data);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao calcular progressão: ${error.message}`);
        res.status(500).json({ message: 'Erro ao calcular progressão.' });
    }
};

export const getVolume = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { weeks } = req.query;

        const weeksNum = weeks ? parseInt(weeks) : 4;
        if (isNaN(weeksNum) || weeksNum < 1 || weeksNum > 52) {
            return res.status(400).json({ message: 'Semanas deve ser entre 1 e 52.' });
        }

        const data = await analyticsService.getWeeklyVolume(userId, weeksNum);

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /analytics/volume - Volume semanal calculado.`);
        res.status(200).json(data);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao calcular volume: ${error.message}`);
        res.status(500).json({ message: 'Erro ao calcular volume semanal.' });
    }
};

export const getRecords = async (req, res) => {
    try {
        const { id: userId } = req.user;

        const data = await analyticsService.getPersonalRecords(userId);

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /analytics/records - ${data.totalExercises} PRs encontrados.`);
        res.status(200).json(data);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao buscar records: ${error.message}`);
        res.status(500).json({ message: 'Erro ao buscar personal records.' });
    }
};

export const getFrequency = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { period } = req.query;

        const periodDays = period ? parseInt(period) : 30;
        if (isNaN(periodDays) || periodDays < 7 || periodDays > 365) {
            return res.status(400).json({ message: 'Período deve ser entre 7 e 365 dias.' });
        }

        const data = await analyticsService.getWorkoutFrequency(userId, periodDays);

        console.log(`[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /analytics/frequency - Frequência calculada.`);
        res.status(200).json(data);
    } catch (error) {
        console.error(`[ERRO] ${new Date().toISOString()} - Erro ao calcular frequência: ${error.message}`);
        res.status(500).json({ message: 'Erro ao calcular frequência de treinos.' });
    }
};
