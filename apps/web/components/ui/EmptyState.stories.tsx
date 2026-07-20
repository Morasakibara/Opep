import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';
import { Inbox, SearchX } from 'lucide-react';

const meta: Meta<typeof EmptyState> = {
  title: 'UI/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  argTypes: {
    title: { control: 'text' },
    message: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {},
};

export const NoResults: Story = {
  args: {
    icon: <SearchX size={32} className="text-gray-400" />,
    title: 'Aucun résultat',
    message: 'Essayez de modifier vos critères de recherche.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Aucun employé',
    message: 'Commencez par ajouter un employé à votre agence.',
    action: { label: 'Ajouter un employé', onClick: () => alert('Action déclenchée') },
  },
};
