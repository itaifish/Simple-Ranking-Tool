module.exports = {
	root: true,
	plugins: ["react"],
	parserOptions: {
		ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
		sourceType: "module", // Allows for the use of imports
		ecmaFeatures: {
			jsx: true,
			modules: true,
		},
	},
	extends: [
		"plugin:react/recommended", // React reccoemndations
	],
	rules: {
		// Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
		// e.g. "@typescript-eslint/explicit-function-return-type": "off",
		indent: "off",
		"@typescript-eslint/indent": ["error", "tab"]
	},
	overrides: [
		{
			parser: "@typescript-eslint/parser", // Specifies the ESLint parser
			files: ["**/*.ts", "**/*.tsx", "**/*.js"],
			plugins: ["@typescript-eslint"],
			extends: [
				"plugin:@typescript-eslint/recommended", // Uses the recommended rules from the @typescript-eslint/eslint-plugin
			],
			rules: {
				"@typescript-eslint/no-empty-interface": [
					"off",
					{
						allowSingleExtends: true,
					},
				],
				"no-use-before-define": "off",
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/interface-name-prefix": "off",
				"@typescript-eslint/no-use-before-define": ["error"],
			},
		},
	],
	settings: {
		react: {
			version: "detect",
		},
	},
};
