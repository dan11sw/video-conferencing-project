import dotenv from 'dotenv';
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });
import DataRoles from './roles.js';

const initRoles = async (db) => {
    const t = await db.sequelize.transaction();
    try {
        for (let i = 0; i < DataRoles.length; i++) {
            const currentRole = DataRoles[i];

            const role = await db.Roles.findOne({
                where: {
                    title: currentRole.title,
                    description: currentRole.description,
                    priority: currentRole.priority
                }
            });

            if (!role) {
                await db.Roles.create({
                    title: currentRole.title,
                    description: currentRole.description,
                    priority: currentRole.priority
                }, { transaction: t });
            }
        }

        await t.commit();
    } catch (e) {
        await t.rollback();
    }
};

export default initRoles;