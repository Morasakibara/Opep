"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@nestjs/testing");
const common_1 = require("@nestjs/common");
const request = require("supertest");
const app_module_1 = require("./../src/app.module");
describe('OPEP API (e2e)', () => {
    let app;
    beforeAll(async () => {
        const moduleFixture = await testing_1.Test.createTestingModule({
            imports: [app_module_1.AppModule],
        }).compile();
        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
        await app.init();
    });
    afterAll(async () => {
        await app.close();
    });
    describe('POST /auth/login', () => {
        it('fails with 400 when body is empty', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({})
                .expect(400);
        });
        it('fails with 400 when identifier is missing', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ password: 'secret123' })
                .expect(400);
        });
        it('fails with 400 when password is missing', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ identifier: 'awa@opep.test' })
                .expect(400);
        });
        it('fails with 401 for non-existent user', () => {
            return request(app.getHttpServer())
                .post('/auth/login')
                .send({ identifier: 'ghost@nonexistent.test', password: 'secret123' })
                .expect(401);
        });
    });
    describe('POST /auth/register', () => {
        it('fails with 400 when body is empty', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({})
                .expect(400);
        });
        it('fails with 400 when firstName/lastName/phone/password are missing', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({ email: 'test@test.com' })
                .expect(400);
        });
        it('fails with 400 for invalid email format', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                firstName: 'John',
                lastName: 'Doe',
                phone: '670000001',
                password: 'secret123',
                email: 'invalid-email',
                role: 'CLIENT',
            })
                .expect(400);
        });
        it('fails with 400 for invalid role enum', () => {
            return request(app.getHttpServer())
                .post('/auth/register')
                .send({
                firstName: 'John',
                lastName: 'Doe',
                phone: '670000002',
                password: 'secret123',
                role: 'INVALID_ROLE',
            })
                .expect(400);
        });
    });
    describe('POST /auth/refresh', () => {
        it('fails with 401 when refresh_token is missing (no DTO — raw body extraction goes to authService which throws UnauthorizedException)', () => {
            return request(app.getHttpServer())
                .post('/auth/refresh')
                .send({})
                .expect(401);
        });
    });
    describe('POST /auth/otp/verify', () => {
        it('returns 401 for an invalid/expired OTP', () => {
            return request(app.getHttpServer())
                .post('/auth/otp/verify')
                .send({ phone: '670000001', otp: '000000' })
                .expect(401);
        });
    });
    describe('POST /auth/reset-password', () => {
        it('fails with 400 when body is empty', () => {
            return request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({})
                .expect(400);
        });
        it('fails with 400 when phone and newPassword are missing', () => {
            return request(app.getHttpServer())
                .post('/auth/reset-password')
                .send({ phone: '670000001' })
                .expect(400);
        });
    });
    describe('Protected endpoints (no auth token)', () => {
        const protectedEndpoints = [
            { method: 'post', path: '/payments/process' },
            { method: 'get', path: '/payments/reservation/some-uuid' },
            { method: 'post', path: '/tickets/generate/some-uuid' },
            { method: 'get', path: '/tickets/my' },
            { method: 'post', path: '/tickets/validate' },
            { method: 'get', path: '/tickets/some-uuid' },
            { method: 'get', path: '/tickets/reservation/some-uuid' },
            { method: 'get', path: '/reservations' },
            { method: 'post', path: '/reservations' },
            { method: 'get', path: '/reservations/my' },
            { method: 'get', path: '/reservations/some-uuid' },
        ];
        for (const { method, path } of protectedEndpoints) {
            it(`${method.toUpperCase()} ${path} returns 401 without auth token`, () => {
                const agent = request(app.getHttpServer());
                const req = method === 'post' ? agent.post(path) : agent.get(path);
                return req.send(method === 'post' ? {} : undefined).expect(401);
            });
        }
    });
});
//# sourceMappingURL=app.e2e-spec.js.map