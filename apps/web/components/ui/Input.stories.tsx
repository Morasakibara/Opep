import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { Search, Mail, Lock } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text', description: 'Label du champ' },
    error: { control: 'text', description: "Message d'erreur" },
    placeholder: { control: 'text', description: 'Placeholder' },
    type: { control: 'select', options: ['text', 'email', 'password', 'tel', 'number'] },
    disabled: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Entrez votre texte...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Adresse email',
    placeholder: 'exemple@email.com',
    type: 'email',
  },
};

export const WithLeftIcon: Story = {
  args: {
    placeholder: 'Rechercher...',
    leftIcon: <Search size={18} />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    placeholder: 'exemple@email.com',
    type: 'email',
    error: 'Adresse email invalide',
    leftIcon: <Mail size={18} />,
  },
};

export const Password: Story = {
  args: {
    label: 'Mot de passe',
    type: 'password',
    placeholder: '••••••••',
    leftIcon: <Lock size={18} />,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Email',
    value: 'admin@opep.cm',
    disabled: true,
    leftIcon: <Mail size={18} />,
  },
};
