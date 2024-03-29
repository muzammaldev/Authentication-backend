import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { SignupDto } from './dto/signup.dto';
import { EmailService } from 'src/email/email.service';
import { verifySignupDto } from './dto/verifySignup.dto';

@Controller('/user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  @Post('/signup')
  async signup(@Body() signupDto: SignupDto) {
    const user = await this.userService.signup(signupDto);
    if (user) {
      await this.emailService.sendMail(
        user.Email,
        `Your VaricationCode Is ${user.varifcationCode}`,
      );
    } else {
      throw new NotFoundException('User not found');
    }

    const message = user.message;

    return { message };
  }

  @Post('/signupVerify')
  async signupVerify(@Body() verifySignup: verifySignupDto) {
    const user = await this.userService.signupVerify(verifySignup);

    return { user };
  }
}
