import Users from '../models/userModels.js';
import { sendVerificationEmail } from '../services/emailConfig.js';
import generateRandomCode from '../utils/verificationCode.js';
import { hashPassword } from '../utils/encriptation.js';
import { login } from '../controller/loginController.js';
import { createToken } from '../utils/jwt.js';

import dotenv from 'dotenv';
dotenv.config();

// Controller for user registration
export const registerUser = async (req, res) => {
  const { email } = req.body;

  try {
    let user = await Users.findOne({ email });

    // registered user with google

    if (user && user.verificationCode === undefined || user && user.cellNumber) {
      return res.status(401).json({ message: 'Email registrado' });
    }

    if (!user) {
      // User is not registered, generate a 4-digit verification code
      const verificationCode = generateRandomCode(4);

      // Create a new user
      user = new Users({
        email,
        verificationCode,
        emailStatus: 'UNVERIFIED', // Assuming this field is used for email status
      });

      // Save the new user in the database
      await user.save();

      // payload
      const payload = {
        emailStatus: user.emailStatus,
        hasAllData: user.hasAllData,
      };
      // Send the verification code to the user (e.g., via email)
      await sendVerificationEmail(user, verificationCode);

      return res.status(200).json({ message: 'Verification code sent.', ...payload });
    } else {
      if (user.emailStatus === 'UNVERIFIED') {
        // User is registered but hasn't verified the code
        // Resend the verification code
        const verificationCode = user.verificationCode;
        const payload = {
          emailStatus: user.emailStatus,
          hasAllData: user.hasAllData,
        };

        await sendVerificationEmail(user, verificationCode);

        return res.json({ message: 'Verification code resent.', ...payload });
      } else if (user.emailStatus === 'VERIFIED') {
        if (!user.hasAllData) {
          const { firstName, lastName, password, cellNumber } = req.body;

          // Hash the password
          const hashedPassword = await hashPassword(password);

          user.firstName = firstName;
          user.lastName = lastName;
          user.password = hashedPassword;

          // Update cellNumber only if given in the request
          if (cellNumber !== undefined) {
            user.cellNumber = cellNumber;
          }

          user.hasAllData = true;

          await user.save();
          const payload = {
            emailStatus: user.emailStatus,
            hasAllData: user.hasAllData,
          };
          // Redirect to login controller
          return login(req, res);
        }
      }
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Server error.' });
  }
};

export const emailVerification = async (req, res) => {
  const { email, verificationCode } = req.body;

  try {
    let user = await Users.findOne({ email });
    console.log(user);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.emailStatus === 'VERIFIED') {
      return res.status(400).json({ message: 'User is already verified.' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ error: 'Incorrect verification code.' });
    }

    // Verify verification code in database and save user verified status
    user.emailStatus = 'VERIFIED';
    await user.save();
    const payload = {
      emailStatus: user.emailStatus,
      hasAllData: user.hasAllData,
    };

    return res.status(200).json({ message: 'User verified.', ...payload });
  } catch (error) {
    console.error('Error during email verification:', error);
    return res
      .status(500)
      .json({ error: 'An internal server error occurred.' });
  }
};

export const registerLogin = async (req, res) => {
  const { name, lastName, email } = req.body;

  try {
    let user = await Users.findOne({ email });

    // User doesn´t exit save it´s basic data
    if (!user) {
      user = new Users({
        firstName: name,
        lastName: lastName,
        email: email,
      });

      await user.save();

      // crate a token to be send in correct response
      const token = await createToken({
        id: user._id,
      });

      // send token by coockie
      res.cookie('token', token, {
        httpOnly: process.env.NODE_ENV !== 'development',
        secure: true,
        sameSite: 'none',
      });
      res.status(200).json({ message: 'logged sucessfully', token });
    } else {
      // crate a token to be send in correct response
      const token = await createToken({
        id: user._id,
      });

      // send token by coockie
      res.cookie('token', token, {
        httpOnly: process.env.NODE_ENV !== 'development',
        secure: true,
        sameSite: 'none',
      });
      res.status(200).json({ message: 'logged sucessfully', token });
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: 'An internal server error occurred.' });
  }
};
