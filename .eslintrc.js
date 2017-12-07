module.exports = {
    "extends": "google",
    rules: {
      // This is silly. Negated conditions are highly useful and often much more concise than
      // their complements.
      "no-negated-condition": "off"
    }
};
