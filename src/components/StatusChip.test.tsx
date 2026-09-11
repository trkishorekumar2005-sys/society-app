import { render } from '@testing-library/react-native';

import { StatusChip } from './StatusChip';

describe('StatusChip', () => {
  it('renders the given label', async () => {
    const { getByText } = await render(<StatusChip label="Open" tone="warning" />);
    expect(getByText('Open')).toBeTruthy();
  });
});
