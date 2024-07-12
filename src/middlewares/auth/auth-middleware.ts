import { NextFunction, Response, Request } from 'express';
import { jwtService } from "../../application/jwt-service";
import { UsersRepository } from "../../repositories/users-repository";
import { usersCollection } from "../../db/db";
import { body } from "express-validator";
import { inputValidationMiddleware } from "../inputValidation/input-validation-middleware";
import {SessionService} from "../../domain/session-service";

// Middleware для базовой аутентификации
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Проверяем наличие и правильность заголовка авторизации
    if (req.headers['authorization'] !== 'Basic YWRtaW46cXdlcnR5') {
        res.sendStatus(401); // Если заголовок неправильный, возвращаем 401 (Unauthorized)
        return;
    }
    return next(); // Если все в порядке, передаем управление следующему middleware
}

// Middleware для аутентификации с использованием Bearer токена
export const authMiddlewareBearer = async (req: Request, res: Response, next: NextFunction) => {
    // Проверяем наличие заголовка авторизации
    if (!req.headers.authorization) {
        res.sendStatus(401); // Если заголовок отсутствует, возвращаем 401 (Unauthorized)
        return;
    }
    // Извлекаем токен из заголовка
    const token = req.headers.authorization.split(' ')[1];
    // Получаем ID пользователя по токену
    const userId = await jwtService.getUserIdByToken(token);
    // Ищем пользователя в базе данных
    const user = await UsersRepository.findUserById(userId);
    if (user) {
        req.userDto = user; // Добавляем пользователя в объект запроса
        next(); // Передаем управление следующему middleware
        return;
    }
    res.sendStatus(401); // Если пользователь не найден, возвращаем 401 (Unauthorized)
}

// Валидатор для уникального email
export const uniqEmailValidator = body("email")
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)
    .withMessage('Email is not valid')
    .custom(async (email) => {
        // Проверяем наличие пользователя с таким email в базе данных
        const existingUser = await usersCollection.findOne({ 'accountData.email': email });
        if (existingUser) {
            throw new Error("пользователь с таким email существует");
        }
        return true;
    });

// Валидатор для пароля
const passwordValidator = body('password')
    .isString().withMessage('Password must be a string')
    .trim().isLength({ min: 6, max: 20 }).withMessage('Incorrect password');

// Валидатор для уникального логина
export const uniqLoginValidator = body("login")
    .isString()
    .matches(/^[a-zA-Z0-9_-]*$/).withMessage('Login is not valid')
    .isLength({ min: 3, max: 10 })
    .custom(async (login) => {
        // Проверяем наличие пользователя с таким логином в базе данных
        const existingUser = await usersCollection.findOne({ 'accountData.userName': login });
        if (existingUser) {
            throw new Error("пользователь с таким login существует");
        }
        return true;
    });

// Валидатор для подтверждения пользователя по email
export const userConfirmedValidator = body("email")
    .isString()
    .matches(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/).withMessage('Email is not Valid')
    .custom(async (email) => {
        // Ищем пользователя в базе данных по email
        const user = await usersCollection.findOne({ 'accountData.email': email });

        if (!user) {
            throw new Error("пользователя нет");
        }
        // Проверяем, подтвержден ли пользователь
        if (user.emailConfirmation.isConfirmed) {
            throw new Error("пользователь уже подтвержден");
        }
        return true;
    });

// Middleware для аутентификации с использованием refresh токена
export const authMiddlewareRefresh = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken;


    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }

    try {
        // Получаем ID пользователя по refresh токену
        const payload = await jwtService.getUserIdByRefreshToken(refreshToken);
        if(!payload){
            res.sendStatus(401); // Если пользователь не найден, возвращаем 401 (Unauthorized)
            return;
        }
        const lastActiveDate  = new Date(payload.iat! * 1000);// доставать не только юзер ай ди но и девайс айди и iat

        // Ищем пользователя в базе данных
        const user = await UsersRepository.findUserById(payload.userId);
        //найти сессию и проверить что ласт эктив дейт  = iat
        const session = await SessionService.findSessionByDeviceId(payload.deviceId)


        if (user && session && session.lastActiveDate.toISOString() === lastActiveDate.toISOString()) {
            req.userDto = user; // Добавляем пользователя в объект запроса
            console.log(req.userDto)
            req.deviceId = payload.deviceId
            return  next()
        } else {
            res.status(401).send({ message: "Сессия не найдена или lastActiveDate не совпадает с iat" });
        }

    } catch (error) {
        res.sendStatus(401); // Если токен протух или неверный, возвращаем 401 (Unauthorized)
    }
};

// Функция для валидации при регистрации
export const registrationValidation = () => [
    uniqEmailValidator,
    passwordValidator,
    uniqLoginValidator,
    inputValidationMiddleware
];

// Функция для валидации при повторной отправке письма с подтверждением
export const emailResendingValidation = () => [
    userConfirmedValidator,
    inputValidationMiddleware
];
