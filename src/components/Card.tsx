import type { ComponentProps, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

export type AppCardProps = ComponentProps<typeof PaperCard> & {
  children: ReactNode;
};

/** Standard elevated card with consistent radius/spacing, built on Paper's Card. */
export function Card({ children, style, ...rest }: AppCardProps) {
  return (
    <PaperCard mode="elevated" style={[styles.card, style]} {...rest}>
      {children}
    </PaperCard>
  );
}

Card.Content = PaperCard.Content;
Card.Title = PaperCard.Title;
Card.Actions = PaperCard.Actions;

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    marginBottom: 12,
  },
});
