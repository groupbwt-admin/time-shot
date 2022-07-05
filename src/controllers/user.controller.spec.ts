import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from '../services/user.service';
import { UserController } from './user.controller';

describe('UserController', () => {
    let controller: UserController;

    const mockUserService = {
        find: jest.fn(() => {
            return [];
        }),
        findOneByEmail: jest.fn((email) => {
            return { email };
        })
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [UserService]
        }).overrideProvider(UserService).useValue(mockUserService).compile();

        controller = module.get<UserController>(UserController);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should get all users', async () => {
        expect(await controller.findAll()).toEqual([]);
        expect(mockUserService.find).toHaveBeenCalled();
    });

    it('shoud get profile current user', async () => {
        const req = { user: { username: 'user@user.com' } };
        expect(await controller.getProfile(req)).toEqual({ email: 'user@user.com' });
        expect(mockUserService.findOneByEmail).toHaveBeenCalled();
    });

});