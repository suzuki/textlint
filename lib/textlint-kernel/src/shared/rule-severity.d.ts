import { TextlintRuleOptions } from "../textlint-kernel-interface";
/**
 * get severity level from ruleConfig.
 * @param {Object|boolean|undefined} ruleConfig
 * @returns {number}
 */
export declare function getSeverity(ruleConfig?: TextlintRuleOptions | boolean): number;
