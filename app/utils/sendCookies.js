export const sendCookies = async (user, statusCode, res) => {
  const token = await user.generateJWT();
  // const options = {
  //   httpOnly: true,
  //   expires: new Date(
  //     Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
  //   ),
  // };
  // res.cookie("token", token, options);
  res.status(statusCode).json({
    success: true,
    user: user,
    token,
  });
};
