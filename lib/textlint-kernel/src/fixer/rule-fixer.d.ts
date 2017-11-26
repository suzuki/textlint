import { TxtNode } from "../textlint-kernel-interface";
import { SourceCodeRange } from "../core/source-code";
/**
 * Creates code fixing commands for rules.
 * It create command for fixing texts.
 * The `range` arguments of these command is should be **relative** value from reported node.
 * See {@link SourceLocation} class for more detail.
 * @constructor
 */
export default class RuleFixer {
    /**
     * Creates a fix command that inserts text after the given node or token.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to insert after.
     * @param {string} text The text to insert.
     * @returns {FixCommand} The fix command.
     */
    insertTextAfter(node: TxtNode, text: string): {
        range: number[];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that inserts text after the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to replace, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @param {string} text The text to insert.
     * @returns {FixCommand} The fix command.
     */
    insertTextAfterRange(range: SourceCodeRange, text: string): {
        range: number[];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that inserts text before the given node or token.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to insert before.
     * @param {string} text The text to insert.
     * @returns {FixCommand} The fix command.
     */
    insertTextBefore(node: TxtNode, text: string): {
        range: number[];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that inserts text before the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to replace, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @param {string} text The text to insert.
     * @returns {FixCommand} The fix command.
     */
    insertTextBeforeRange(range: SourceCodeRange, text: string): {
        range: number[];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that replaces text at the node or token.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to remove.
     * @param {string} text The text to insert.
     * @returns {FixCommand} The fix command.
     */
    replaceText(node: TxtNode, text: string): {
        range: [number, number];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that replaces text at the specified range in the source text.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to replace, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @param {string} text The text to insert.
     * @returns {FixCommand} The fix command.
     */
    replaceTextRange(range: SourceCodeRange, text: string): {
        range: [number, number];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that removes the node or token from the source.
     * The fix is not applied until applyFixes() is called.
     * @param {TxtNode} node The node or token to remove.
     * @returns {FixCommand} The fix command.
     */
    remove(node: TxtNode): {
        range: [number, number];
        text: string;
        isAbsolute: boolean;
    };
    /**
     * Creates a fix command that removes the specified range of text from the source.
     * The fix is not applied until applyFixes() is called.
     * @param {number[]} range The range to remove, first item is start of range, second
     *      is end of range.
     *      The `range` should be **relative** value from reported node.
     * @returns {FixCommand} The fix command.
     */
    removeRange(range: SourceCodeRange): {
        range: [number, number];
        text: string;
        isAbsolute: boolean;
    };
}
