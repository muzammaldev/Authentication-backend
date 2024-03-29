import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import * as crypto from 'crypto';
import { verifySignupDto } from './dto/verifySignup.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User & Document>,
    private readonly jwtService: JwtService,
  ) {}
  async signup(signupDto: SignupDto): Promise<{
    message: string;
    token: string;
    varifcationCode: number;
    Email: string;
  }> {
    const { name, email, password } = signupDto;

    const alreadyUser = await this.userModel.findOne({ email });

    if (alreadyUser) {
      throw new UnauthorizedException('Email Already Exits');
    }
    const randomBytes = crypto.randomBytes(3);

    // Convert randomBytes to a Promise-based function
    const randomBytesAsync = () =>
      new Promise<Buffer>((resolve) => resolve(randomBytes));

    // Use async/await to generate the random number
    const randomNumber =
      (parseInt((await randomBytesAsync()).toString('hex'), 16) % 900000) +
      100000;

    const user = await this.userModel.create({
      name,
      email,
      password,
      varifcationCode: randomNumber,
      isVerified: false,
    });

    const token = await this.jwtService.sign(
      {
        name: user.name,
        email: user.email,
        id: user._id,
      },

      {
        secret: process.env.SECRET_KEY,
      },
    );

    const Email = user.email;
    const varifcationCode = user.varifcationCode;

    return {
      message: 'Email Sent to Your Email',
      token,
      Email,
      varifcationCode,
    };
  }

  async signupVerify(
    verifySignupDto: verifySignupDto,
  ): Promise<{ message: string }> {
    const { email, varifcationCode } = verifySignupDto;

    const user = await this.userModel.findOne({ varifcationCode });

    console.log(user, 'user');

    if (user.varifcationCode) {
      return { message: 'good hogya' };
    } else {
      return { message: 'code not found' };
    }
  }
}
