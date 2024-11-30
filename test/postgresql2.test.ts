import dedent from 'dedent-js';

import { format as originalFormat, FormatFn } from '../src/sqlFormatter.js';

import behavesLikeSqlFormatter from './behavesLikeSqlFormatter.js';
import supportsAlterTable from './features/alterTable.js';
import supportsBetween from './features/between.js';
import supportsCreateTable from './features/createTable.js';
import supportsDropTable from './features/dropTable.js';
import supportsJoin from './features/join.js';
import supportsOperators from './features/operators.js';
import supportsSchema from './features/schema.js';
import supportsStrings from './features/strings.js';
import supportsReturning from './features/returning.js';
import supportsConstraints from './features/constraints.js';
import supportsDeleteFrom from './features/deleteFrom.js';
import supportsComments from './features/comments.js';
import supportsCommentOn from './features/commentOn.js';
import supportsIdentifiers from './features/identifiers.js';
import supportsParams from './options/param.js';
import supportsArrayAndMapAccessors from './features/arrayAndMapAccessors.js';
import supportsWindow from './features/window.js';
import supportsSetOperations from './features/setOperations.js';
import supportsLimiting from './features/limiting.js';
import supportsInsertInto from './features/insertInto.js';
import supportsUpdate from './features/update.js';
import supportsTruncateTable from './features/truncateTable.js';
import supportsCreateView from './features/createView.js';
import supportsOnConflict from './features/onConflict.js';
import supportsIsDistinctFrom from './features/isDistinctFrom.js';
import supportsArrayLiterals from './features/arrayLiterals.js';
import supportsDataTypeCase from './options/dataTypeCase.js';

describe('PostgreSqlFormatter 2', () => {
  const language = 'postgresql';
  const format: FormatFn = (query, cfg = {}) => originalFormat(query, { ...cfg, language });

  behavesLikeSqlFormatter(format);
  supportsComments(format, { nestedBlockComments: true });
  supportsCommentOn(format);
  supportsCreateView(format, { orReplace: true, materialized: true, ifNotExists: true });
  supportsCreateTable(format, { ifNotExists: true });
  supportsDropTable(format, { ifExists: true });
  supportsConstraints(format, ['NO ACTION', 'RESTRICT', 'CASCADE', 'SET NULL', 'SET DEFAULT']);
  supportsArrayLiterals(format, { withArrayPrefix: true });
  supportsArrayAndMapAccessors(format);
  supportsAlterTable(format, {
    addColumn: true,
    dropColumn: true,
    renameTo: true,
    renameColumn: true,
  });
  supportsDeleteFrom(format);
  supportsInsertInto(format);
  supportsOnConflict(format);
  supportsUpdate(format, { whereCurrentOf: true });
  supportsTruncateTable(format, { withoutTable: true });
  supportsStrings(format, ["''-qq", "U&''", "X''", "B''"]);
  supportsIdentifiers(format, [`""-qq`, 'U&""']);
  supportsBetween(format);
  supportsSchema(format);
  // Missing: '::' type cast (tested separately)
  supportsOperators(
    format,
    [
      // Arithmetic
      '%',
      '^',
      '|/',
      '||/',
      '@',
      // Assignment
      ':=',
      // Bitwise
      '&',
      '|',
      '#',
      '~',
      '<<',
      '>>',
      // Byte comparison
      '~>~',
      '~<~',
      '~>=~',
      '~<=~',
      // Geometric
      '@-@',
      '@@',
      '##',
      '<->',
      '&&',
      '&<',
      '&>',
      '<<|',
      '&<|',
      '|>>',
      '|&>',
      '<^',
      '^>',
      '?#',
      '?-',
      '?|',
      '?-|',
      '?||',
      '@>',
      '<@',
      '~=',
      // JSON
      '?',
      '@?',
      '?&',
      '->',
      '->>',
      '#>',
      '#>>',
      '#-',
      // Named function params
      '=>',
      // Network address
      '>>=',
      '<<=',
      // Pattern matching
      '~~',
      '~~*',
      '!~~',
      '!~~*',
      // POSIX RegExp
      '~',
      '~*',
      '!~',
      '!~*',
      // Range/multirange
      '-|-',
      // String concatenation
      '||',
      // Text search
      '@@@',
      '!!',
      '^@',
      // Trigram/trigraph
      '<%',
      '<<%',
      '%>',
      '%>>',
      '<<->',
      '<->>',
      '<<<->',
      '<->>>',
    ],
    { any: true }
  );
  supportsIsDistinctFrom(format);
  supportsJoin(format);
  supportsSetOperations(format);
  supportsReturning(format);
  supportsParams(format, { numbered: ['$'] });
  supportsWindow(format);
  supportsLimiting(format, { limit: true, offset: true, fetchFirst: true, fetchNext: true });
  supportsDataTypeCase(format);

  // Issue #711
  it('supports OPERATOR() syntax', () => {
    expect(format(`SELECT foo OPERATOR(public.===) bar;`)).toBe(dedent`
      SELECT foo OPERATOR(public.===) bar;
    `);
  });
});
