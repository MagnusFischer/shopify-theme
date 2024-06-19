import type { ComponentType } from '@spinnakernordic/micro-components';

const Component: ComponentType = (node) => {
  const videoMobile = node.querySelector<HTMLVideoElement>('[data-mobile]');
  const videoDesktop = node.querySelector<HTMLVideoElement>('[data-desktop]');
  const playButtons = node.querySelectorAll<HTMLButtonElement>('[data-play]');

  const loadVideo = (video) => {
    Object.entries(video.children).forEach((key, value) => {
      const videoSource: HTMLSourceElement = video.children[value] as HTMLSourceElement;
      if (typeof videoSource.tagName === 'string' && videoSource.tagName === 'SOURCE') {
        videoSource.src = videoSource.dataset.src;
      }
    });

    video.load();

    const playButton: HTMLButtonElement = video.parentElement.querySelector('[data-play]');
    if (playButton != null) {
      playButton.disabled = false;
    }

    if (video.hasAttribute('autoplay')) {
      video.play();
    }
  };

  const resetVideoStates = () => {
    if (videoMobile != null && !videoMobile.hasAttribute('autoplay')) {
      videoMobile.pause();
      videoMobile.controls = false;
      videoMobile.currentTime = 0;
    }

    if (videoDesktop != null && !videoDesktop.hasAttribute('autoplay')) {
      videoDesktop.pause();
      videoDesktop.controls = false;
      videoDesktop.currentTime = 0;
    }

    playButtons.forEach((button) => {
      button.hidden = false;
    });
  };

  const initializeVideo = () => {
    resetVideoStates();
    if (window.innerWidth < 1024) {
      if (videoMobile !== null && videoMobile.readyState <= 3) loadVideo(videoMobile);
    } else if (videoDesktop !== null && videoDesktop.readyState <= 3) loadVideo(videoDesktop);
  };

  import(/* webpackChunkName: "lodash" */ 'lodash-es/debounce').then(({ default: debounce }) => {
    window.addEventListener('resize', debounce(initializeVideo, 100));
  });

  playButtons.forEach((button) => {
    button.addEventListener('click', () => {
      button.hidden = true;

      if (window.innerWidth < 1024) {
        videoMobile.play();
        if (!videoMobile.hasAttribute('autoplay')) {
          videoMobile.controls = true;
        }
      } else {
        videoDesktop.play();
        if (!videoDesktop.hasAttribute('autoplay')) {
          videoDesktop.controls = true;
        }
      }
    });
  });

  initializeVideo();
};

export default Component;
