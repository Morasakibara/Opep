import type { Meta, StoryObj } from '@storybook/react';
import { ErrorState } from './ErrorState';

const meta: Meta<typeof ErrorState> = {
  title: 'UI/ErrorState',
  component: ErrorState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {
  args: {},
};

export const NetworkError: Story = {
  args: {
    title: 'Erreur réseau',
    message: 'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
  },
};

export const WithRetry: Story = {
  args: {
    title: 'Échec du chargement',
    message: 'Les données n\'ont pas pu être récupérées.',
    onRetry: () => alert('Nouvelle tentative...'),
  },
};
