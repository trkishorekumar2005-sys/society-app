import { fireEvent, render } from '@testing-library/react-native';

import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  it('renders the given message', async () => {
    const { getByText } = await render(<ErrorState message="Something broke." />);
    expect(getByText('Something broke.')).toBeTruthy();
  });

  it('does not render a Retry button when onRetry is omitted', async () => {
    const { queryByText } = await render(<ErrorState message="Something broke." />);
    expect(queryByText('Retry')).toBeNull();
  });

  it('calls onRetry when the Retry button is pressed', async () => {
    const onRetry = jest.fn();
    const { getByText } = await render(<ErrorState message="Something broke." onRetry={onRetry} />);

    fireEvent.press(getByText('Retry'));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});
