export const openModalAnimation = () => {
  const modalElement = document.getElementById('modal');
  modalElement?.animate(
    [
      {
        opacity: 0,
        transform: 'translateY(100%) scale(0.2, 0.1)',
        transformOrigin: 'bottom center',
      },
      {
        opacity: 0.4,
        transform: 'translateY(40%) scale(0.6, 0.8)',
        transformOrigin: 'bottom center',
        offset: 0.5,
      },
      {
        opacity: 1,
        transform: 'translateY(0%) scale(1)',
        transformOrigin: 'center center',
      },
    ],
    {
      duration: 450,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'forwards',
    },
  );
};

export const closeModalAnimation = () => {
  const modalElement = document.getElementById('modal');
  if (!modalElement) return;

  const animation = modalElement.animate(
    [
      {
        opacity: 1,
        transform: 'translateY(0%) scale(1)',
        transformOrigin: 'center center',
      },
      {
        opacity: 0.4,
        transform: 'translateY(40%) scale(0.6, 0.8)',
        transformOrigin: 'bottom center',
        offset: 0.5,
      },
      {
        opacity: 0,
        transform: 'translateY(100%) scale(0.2, 0.1)',
        transformOrigin: 'bottom center',
      },
    ],
    {
      duration: 350,
      easing: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
      fill: 'forwards',
    },
  );

  return animation.finished;
};

export const openPostAnimation = () => {
  const element = document.documentElement;
  element?.animate(
    [
      {
        opacity: 1,
        scale: 1,
        transform: 'translateX(0)',
      },
      {
        opacity: 0.1,
        scale: 0.9,
        transform: 'translateX(-100px)',
      },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  );

  element?.animate(
    [
      {
        transform: 'translateX(100%)',
      },
      {
        transform: 'translateX(0)',
      },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.76, 0, 0.24, 1)',
      fill: 'forwards',
      pseudoElement: '::view-transition-new(root)',
    },
  );
};

export const closePostAnimation = () => {
  const element = document.documentElement;
  element?.animate(
    [
      {
        opacity: 1,
        transform: 'translateX(0)',
      },
      {
        opacity: 0,
        transform: 'translateX(100px)',
      },
    ],
    {
      duration: 400,
      easing: 'ease',
      fill: 'forwards',
      pseudoElement: '::view-transition-old(root)',
    },
  );
};
