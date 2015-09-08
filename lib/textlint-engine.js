// LICENSE : MIT
"use strict";

var textLint = require("./textlint");
var fileTraverse = require("./util/traverse");
var Config = require("./config/config");
var createFormatter = require("textlint-formatter");
var tryResolve = require("try-resolve");
var path = require("path");
var debug = require("debug")("text:cli-engine");
/**
 * Process files are wanted to lint.
 * TextLintEngine is a wrapper of textlint.js.
 * Aim to be called from cli with cli options.
 * @param {TextLintConfig|} options the options is command line options or Config object.
 * @constructor
 */
function TextLintEngine(options) {
    if (options instanceof Config) {
        // Almost internal use-case
        this.config = options;
    } else {
        this.config = new Config(options);
    }
}
/**
 * filter files by config
 * @param files
 * @param {Config} config
 */
function findFiles(files, config) {
    var processed = [];
    // sync
    fileTraverse({
        files: files,
        extensions: config.extensions,
        exclude: false
    }, function (filename) {
        debug("Processing " + filename);
        processed.push(filename);
    });
    return processed;
}

/**
 * set up lint rules using {@lint Config} object.
 * The {@lint Config} object was created with initialized {@link TextLintEngine} (as-known Constructor).
 * @param {Config} config the config is parsed object
 */
TextLintEngine.prototype.setupRules = function (config) {
    config = config || this.config;
    debug("config %O", config);
    var ruleManager = require("./rule/rule-manager");
    // --ruledir
    if (config.rulePaths) {
        // load in additional rules
        config.rulePaths.forEach(function (rulesdir) {
            debug("Loading rules from %o", rulesdir);
            ruleManager.loadRules(rulesdir);
        });
    }
    // --rule
    if (config.rules) {
        // load in additional rules
        config.rules.forEach(function (ruleName) {
            // ignore already defined rule
            // ignore rules from rulePaths because avoid ReferenceError is that try to require.
            if (ruleManager.isDefinedRule(ruleName)) {
                return;
            }
            var pkgPath = tryResolve("textlint-rule-" + ruleName) || tryResolve(ruleName);
            if (pkgPath) {
                debug("Loading rules from %s", pkgPath);
                var plugin = require(pkgPath);
                var definedRuleName = ruleName.replace(/^textlint\-rule\-/, "");
                ruleManager.defineRule(definedRuleName, plugin);
            } else {
                throw new ReferenceError(ruleName + " is not found --rule");
            }
        });
    }
    textLint.setupRules(ruleManager.getAllRules(), config.rulesConfig);
};
TextLintEngine.prototype.resetRules = function () {
    textLint.resetRules();
};
/**
 * Executes the current configuration on an array of file and directory names.
 * @param {String[]}  files An array of file and directory names.
 * @returns {TextLintResult[]} The results for all files that were linted.
 */
TextLintEngine.prototype.executeOnFiles = function (files) {
    this.setupRules(this.config);
    var targetFiles = findFiles(files, this.config);
    var results = targetFiles.map(function (file) {
        return textLint.lintFile(file);
    });
    textLint.resetRules();
    return results;
};
/**
 * If want to lint a text, use it.
 * But, if you have a target file, use {@link executeOnFiles} instead of it.
 * @param text plain text for lint
 * @returns {TextLintResult[]}
 * @todo specify the files format for lint by config.filetype?
 */
TextLintEngine.prototype.executeOnText = function (text) {
    this.setupRules(this.config);
    var results = [textLint.lintText(text)];
    textLint.resetRules();
    return results;
};

/**
 * format {@link results} and return output text.
 * @param {TextLintResult[]} results the collection of result
 * @returns {string} formatted output text
 * @example
 *  console.log(formatResults(results));
 */
TextLintEngine.prototype.formatResults = function (results) {
    var formatter = createFormatter({
        formatterName: this.config.formatterName
    });
    return formatter(results);
};

/**
 * Checks if the given message is an error message.
 * @param {TextLintMessage} message The message to check.
 * @returns {boolean} Whether or not the message is an error message.
 */
TextLintEngine.prototype.isErrorMessage = function (message) {
    return message.severity === 2;
};

/**
 * Checks if the given results contain error message.
 * If there is even one error then return true.
 * @param {TextLintResult[]} results Linting result collection
 * @returns {Boolean} Whether or not the results contain error message.
 */
TextLintEngine.prototype.isErrorResults = function (results) {
    var that = this;
    return results.some(function (result) {
        return result.messages.some(that.isErrorMessage);
    });
};

module.exports = TextLintEngine;