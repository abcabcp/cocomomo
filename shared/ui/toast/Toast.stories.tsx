import type { Meta, StoryObj } from '@storybook/react';
import { Toast } from './Toast';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Atomic/Toast',
  component: Toast,
  parameters: {
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#333333' },
      ],
    },
    docs: {
      description: {
        component: `
          ### Toast 컴포넌트
          사용자에게 간단한 알림을 표시하는 컴포넌트입니다. 성공(success)과 에러(error) 두 가지 상태를 지원합니다.

          #### 주요 특징
          - 자동으로 일정 시간 후 사라짐 (기본값: 3.5초)
          - 클릭으로 즉시 닫기 가능
          - 애니메이션 효과 제공
        `,
      },
    },
  },
  argTypes: {
    toastState: {
      description: '토스트의 상태를 설정합니다.',
      control: 'object',
      table: {
        type: {
          summary: '{ status: ToastStatus; delay?: number; timeStamp?: number; message?: React.ReactNode; }',
        },
      },
    },
    handleRemoveToast: {
      description: '토스트를 제거할 때 호출되는 함수입니다.',
      action: 'removed',
      table: {
        type: {
          summary: '(timeStamp: number) => void',
        },
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', padding: '20px' }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof Toast>;


export const Success: Story = {
  args: {
    toastState: {
      status: 'success',
      message: '작업이 성공적으로 완료되었습니다.',
      timeStamp: Date.now(),
    },
    handleRemoveToast: (timeStamp) => console.log(`토스트 제거: ${timeStamp}`),
  },
  parameters: {
    docs: {
      description: {
        story: '성공 메시지를 표시하는 토스트입니다. 기본적으로 녹색 배경으로 표시됩니다.',
      },
    },
  },
};

export const ErrorToast: Story = {
  args: {
    toastState: {
      status: 'error',
      message: '작업 중 오류가 발생했습니다.',
      timeStamp: Date.now(),
      delay: 10000,
    },
    handleRemoveToast: (timeStamp) => console.log(`토스트 제거: ${timeStamp}`),
  },
  parameters: {
    docs: {
      description: {
        story: '오류 메시지를 표시하는 토스트입니다. 검은색 배경으로 표시됩니다.',
      },
    },
  },
};

export const LongMessage: Story = {
  args: {
    toastState: {
      status: 'success',
      message: '이것은 매우 긴 메시지를 표시하는 토스트입니다. 길이가 길어도 깔끔하게 표시됩니다. 여러 줄에 걸쳐 표시될 수도 있습니다.',
      timeStamp: Date.now(),
      delay: 10000,
    },
    handleRemoveToast: (timeStamp) => console.log(`토스트 제거: ${timeStamp}`),
  },
  parameters: {
    docs: {
      description: {
        story: '긴 메시지를 표시하는 경우의 토스트 예시입니다.',
      },
    },
  },
};

export const HTMLContent: Story = {
  args: {
    toastState: {
      status: 'success',
      message: (
        <div className='text-black'>
          <strong>HTML 콘텐츠</strong>가 포함된 메시지입니다.
          <br />
          <span style={{ color: '#ff6b6b' }}>다양한 스타일을</span> 적용할 수 있습니다.
        </div>
      ),
      timeStamp: Date.now(),
      delay: 10000,
    },
    handleRemoveToast: (timeStamp) => console.log(`토스트 제거: ${timeStamp}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'React 노드를 메시지로 사용할 수 있어 복잡한 콘텐츠 구성이 가능합니다.',
      },
    },
  },
};

export const ShortDuration: Story = {
  args: {
    toastState: {
      status: 'success',
      message: '짧은 지속 시간 (1.5초) 후 사라집니다',
      timeStamp: Date.now(),
      delay: 1500, // 1.5초
    },
    handleRemoveToast: (timeStamp) => console.log(`토스트 제거: ${timeStamp}`),
  },
  parameters: {
    docs: {
      description: {
        story: '짧은 지속 시간을 가진 토스트입니다. delay 속성으로 지속 시간을 조절할 수 있습니다.',
      },
    },
  },
};


const ToastSequence = () => {
  const [toasts, setToasts] = useState<Array<{ id: number; toast: any }>>([]);

  const handleRemoveToast = (id: number) => {
    setToasts((prev) => prev.filter(toast => toast.id !== id));
  };

  useEffect(() => {
    const id1 = setTimeout(() => {
      setToasts([{
        id: 1,
        toast: {
          status: 'success',
          message: '첫 번째 토스트 메시지입니다.',
          timeStamp: 1,
          delay: 3000,
        }
      }]);
    }, 500);
    const id2 = setTimeout(() => {
      setToasts(prev => [...prev, {
        id: 2,
        toast: {
          status: 'error',
          message: '두 번째 토스트 메시지입니다.',
          timeStamp: 2,
          delay: 3000,
        }
      }]);
    }, 1500);
    const id3 = setTimeout(() => {
      setToasts(prev => [...prev, {
        id: 3,
        toast: {
          status: 'success',
          message: '세 번째 토스트 메시지입니다.',
          timeStamp: 3,
          delay: 3000,
        }
      }]);
    }, 2500);

    return () => {
      clearTimeout(id1);
      clearTimeout(id2);
      clearTimeout(id3);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
      {toasts.map(({ id, toast }) => (
        <Toast
          key={id}
          toastState={toast}
          handleRemoveToast={() => handleRemoveToast(id)}
        />
      ))}
    </div>
  );
};

export const MultipleToasts: Story = {
  render: () => <ToastSequence />,
  parameters: {
    docs: {
      description: {
        story: '여러 개의 토스트가 순차적으로 나타나는 예시입니다.',
      },
    },
  },
};
