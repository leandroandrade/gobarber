import jwt from 'jsonwebtoken';
import { promisify } from 'util';

import authConfig from '../../config/auth';

export default async (req, res, next) => {

    const auhtHeader = req.headers.authorization;
    if (!auhtHeader) {
        return res.status(401).send({ error: 'Token não informado!' });
    }

    const parts = auhtHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).send({ error: 'Formato de token inválido!' });
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).send({ error: 'Token mal formatado!' });
    }

    try {
        const decoded = await promisify(jwt.verify)(token, authConfig.secret);

        req.userId = decoded.id;

        return next();
    } catch (e) {
        return res.status(401).send({ error: 'Token invalido!' });
    }
};