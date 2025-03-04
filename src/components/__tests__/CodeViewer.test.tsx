import { it, expect, describe } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

import CodeViewer from '../CodeViewer';

describe('CodeViewer', () => {
  it('отображает переданный код в виде JSON-строки', () => {
    const sampleCode = { key: 'value', number: 42 };

    render(<CodeViewer code={sampleCode} />);

    // Проверяем, что JSON-строка переданного объекта отображается на странице
    expect(screen.getByText(JSON.stringify(sampleCode))).toBeInTheDocument();
  });
});
