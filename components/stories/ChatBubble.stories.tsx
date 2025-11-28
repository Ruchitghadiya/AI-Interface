import React from 'react';
import { Meta, StoryFn } from '@storybook/react';
import { ChatBubble } from '../ChatOutput';

export default {
  title: 'Components/ChatBubble',
  component: ChatBubble,
  argTypes: {
    message: {
      control: { type: 'object' },
    },
  },
} as Meta<typeof ChatBubble>;

const Template: StoryFn<typeof ChatBubble> = (args) => <ChatBubble {...args} />;

export const UserMessage = Template.bind({});
UserMessage.args = {
  message: {
    id: '1',
    role: 'user',
    content: 'Hello, how are you today?',
    timestamp: new Date(),
  },
};

export const AssistantMessage = Template.bind({});
AssistantMessage.args = {
  message: {
    id: '2',
    role: 'assistant',
    content: 'Hello!',
    timestamp: new Date(),
  },
};

export const LongMessage = Template.bind({});
LongMessage.args = {
  message: {
    id: '3',
    role: 'assistant',
    content: 'This is a much longer message that should demonstrate how the chat bubble handles content that spans multiple lines. The component should properly wrap the text and maintain good spacing and readability throughout the entire message.',
    timestamp: new Date(),
  },
};