const math = require("mathjs");

module.exports = {
  name: "math",
  description: "Evaluates a math problem.",
  aliases: [""],
  run: async (bot, message, args) => {
    let problem = args.join(" ");

    if (problem.includes(" x ")) {
      problem = problem.replace(" x ", " * ");
    }

    message.channel.send(`${args.join(" ")} = ${await math.evaluate(problem)}`);
  }
};
