import { validate as isUUID } from 'uuid';
import * as exerciseService from '../services/exercise.service.js';

const VALID_MUSCLE_GROUPS = [
    'chest',
    'back',
    'shoulders',
    'arms',
    'legs',
    'core',
    'cardio',
    'full_body'
];
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced'];

const validateExerciseData = (body) => {
    if (
        body.name &&
        (typeof body.name !== 'string' || body.name.length < 2 || body.name.length > 100)
    ) {
        return 'O nome deve ter entre 2 e 100 caracteres.';
    }
    if (body.muscleGroup && !VALID_MUSCLE_GROUPS.includes(body.muscleGroup)) {
        return `Grupo muscular inválido. Valores permitidos: ${VALID_MUSCLE_GROUPS.join(', ')}`;
    }
    if (body.difficulty && !VALID_DIFFICULTIES.includes(body.difficulty)) {
        return `Dificuldade inválida. Valores permitidos: ${VALID_DIFFICULTIES.join(', ')}`;
    }
    return null;
};

export const listExercises = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { muscleGroup, difficulty, equipment, name } = req.query;

        const filters = {};
        if (muscleGroup) {
            filters.muscleGroup = muscleGroup;
        }
        if (difficulty) {
            filters.difficulty = difficulty;
        }
        if (equipment) {
            filters.equipment = equipment;
        }
        if (name) {
            filters.name = name;
        }

        const exercises = await exerciseService.getExercises(userId, filters);
        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /exercises - ${exercises.length} exercícios listados.`
        );
        res.status(200).json(exercises);
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Erro ao listar exercícios: ${error.message}`
        );
        res.status(500).json({ message: 'Erro ao listar exercícios.' });
    }
};

export const getExercise = async (req, res) => {
    try {
        const { id } = req.params;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const exercise = await exerciseService.getExerciseById(id);
        if (!exercise) {
            return res.status(404).json({ message: 'Exercício não encontrado.' });
        }

        res.status(200).json(exercise);
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Erro ao buscar exercício: ${error.message}`
        );
        res.status(500).json({ message: 'Erro ao buscar exercício.' });
    }
};

export const createExercise = async (req, res) => {
    try {
        const { id: userId } = req.user;

        if (!req.body.name || !req.body.muscleGroup) {
            return res
                .status(400)
                .json({ message: 'Os campos name e muscleGroup são obrigatórios.' });
        }

        const validationError = validateExerciseData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const exercise = await exerciseService.createExercise(userId, req.body);
        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /exercises - Exercício "${exercise.name}" criado.`
        );
        res.status(201).json(exercise);
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Erro ao criar exercício: ${error.message}`
        );
        res.status(500).json({ message: 'Erro ao criar exercício.' });
    }
};

export const updateExercise = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const validationError = validateExerciseData(req.body);
        if (validationError) {
            return res.status(400).json({ message: validationError });
        }

        const exercise = await exerciseService.updateExercise(id, userId, req.body);
        if (!exercise) {
            return res
                .status(404)
                .json({ message: 'Exercício não encontrado ou não pertence ao usuário.' });
        }

        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /exercises/${id} - Exercício atualizado.`
        );
        res.status(200).json(exercise);
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Erro ao atualizar exercício: ${error.message}`
        );
        res.status(500).json({ message: 'Erro ao atualizar exercício.' });
    }
};

export const deleteExercise = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { id } = req.params;

        if (!isUUID(id)) {
            return res.status(400).json({ message: 'ID inválido.' });
        }

        const exercise = await exerciseService.deleteExercise(id, userId);
        if (!exercise) {
            return res
                .status(404)
                .json({ message: 'Exercício não encontrado ou não pertence ao usuário.' });
        }

        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /exercises/${id} - Exercício desativado.`
        );
        res.status(200).json({ message: 'Exercício removido com sucesso.' });
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Erro ao remover exercício: ${error.message}`
        );
        res.status(500).json({ message: 'Erro ao remover exercício.' });
    }
};

export const importExercises = async (req, res) => {
    try {
        const { id: userId } = req.user;
        const { muscle, type, difficulty, name } = req.query;

        const apiKey = process.env.API_NINJAS_KEY;
        if (!apiKey) {
            return res.status(500).json({ message: 'API Ninjas key não configurada.' });
        }

        const params = new URLSearchParams();
        if (muscle) {
            params.append('muscle', muscle);
        }
        if (type) {
            params.append('type', type);
        }
        if (difficulty) {
            params.append('difficulty', difficulty);
        }
        if (name) {
            params.append('name', name);
        }

        const apiUrl = `https://api.api-ninjas.com/v1/exercises?${params.toString()}`;

        const response = await fetch(apiUrl, {
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`API Ninjas retornou status ${response.status}`);
        }

        const exercisesData = await response.json();

        if (!Array.isArray(exercisesData) || exercisesData.length === 0) {
            return res.status(404).json({ message: 'Nenhum exercício encontrado na API externa.' });
        }

        const imported = await exerciseService.importFromExternalApi(exercisesData, null);

        console.log(
            `[AÇÃO] ${new Date().toISOString()} - Usuário: ${userId} - Endpoint: /exercises/import - ${imported.length} exercícios importados.`
        );
        res.status(201).json({
            message: `${imported.length} exercícios importados com sucesso.`,
            exercises: imported
        });
    } catch (error) {
        console.error(
            `[ERRO] ${new Date().toISOString()} - Erro ao importar exercícios: ${error.message}`
        );
        res.status(500).json({ message: 'Erro ao importar exercícios da API externa.' });
    }
};
