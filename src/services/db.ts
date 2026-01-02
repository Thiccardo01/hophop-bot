// MOCK PRISMA CLIENT FOR EMERGENCY NO-DB MODE
// This file exports a dummy object to satisfy imports without connecting to DB.

const prismaMock = {
    user: {
        findUnique: async () => null,
        create: async () => ({ sessions: [] }),
    },
    session: {
        update: async () => { },
    },
    $connect: async () => { },
    $disconnect: async () => { },
};

export default prismaMock as any;
