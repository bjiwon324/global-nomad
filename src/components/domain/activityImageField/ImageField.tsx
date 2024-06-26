import classNames from 'classnames/bind';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { GetActivityDetail } from '@/types';
import { ICON } from '@/constants';
import debounce from '@/function/debounce';
import IconButton from '@/components/common/button/IconButton';
import style from './ImageField.module.scss';
import ImageViewer from '@/components/common/popup/imageViewer/ImageViewer';
import Banner from '../main/banner/Banner';

const cn = classNames.bind(style);

const { leftArrow, rightArrow } = ICON;

interface ImageFieldProps {
  detailData: GetActivityDetail;
}

export default function ImageField({ detailData: activityDetailData }: ImageFieldProps) {
  const [fieldWidth, setFieldWitdh] = useState(0);
  const [imageFieldIndex, setImageFieldIndex] = useState(0);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState({
    banner: true,
    subImage: activityDetailData.subImages.map(() => true),
  });

  const imageRef = useRef<HTMLImageElement | null>(null);
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  const nextButtonEnable =
    activityDetailData?.subImages &&
    activityDetailData.subImages.length > 0 &&
    activityDetailData.subImages.length - imageFieldIndex !== 0;

  const subImageEnable = activityDetailData?.subImages && activityDetailData.subImages.length < 1;

  const handleNextClick = () => {
    setImageFieldIndex((prev) => {
      const nextIndex = prev + 1;
      onScroll(fieldWidth, nextIndex);
      return nextIndex;
    });
  };
  const handlePrevClick = () => {
    setImageFieldIndex((prev) => {
      const nextIndex = prev - 1;
      onScroll(fieldWidth, nextIndex);
      return nextIndex;
    });
  };

  const handleResize = debounce(() => {
    if (window.innerWidth < 768 && imageRef.current) {
      const { clientWidth } = imageRef.current;
      setFieldWitdh(clientWidth);
      setImageFieldIndex(0);
      onScroll(0, 0, true);
    }
  }, 100);

  const handleImagePopupOpenClick = (url: string) => {
    if (!dialogRef.current) return;
    setImageUrl(url);
    dialogRef.current.showModal();
  };

  const onScroll = (width: number, index: number, initialize: boolean = false) => {
    const container = document.querySelector('#image-field');
    if (!container) return;
    const scrollPosition = width * index;

    if (initialize) {
      container.scrollTo({
        left: scrollPosition,
        behavior: 'instant',
      });
      return;
    }
    container.scrollTo({
      left: scrollPosition,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    if (!activityDetailData && !imageRef.current) return;
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [activityDetailData, imageRef]);

  return (
    <>
      <ImageViewer dialogRef={dialogRef} imageUrl={imageUrl} />
      {activityDetailData && (
        <div className={cn('activity-image')}>
          <div id={'image-field'} className={cn('image-field', { subImage: subImageEnable })} ref={imageRef}>
            {imageFieldIndex !== 0 && (
              <div className={cn('btn-left')}>
                <IconButton
                  type='button'
                  size='sm'
                  svg={leftArrow.variant1.src}
                  alt={leftArrow.variant1.alt}
                  onClick={handlePrevClick}
                />
              </div>
            )}
            {nextButtonEnable && (
              <div className={cn('btn-right')}>
                <IconButton
                  type='button'
                  size='sm'
                  svg={rightArrow.variant1.src}
                  alt={rightArrow.variant1.alt}
                  onClick={handleNextClick}
                />
              </div>
            )}
            <div
              className={cn({ 'image-field-banner': !imageLoading.banner }, { imageLoading: imageLoading.banner })}
              onClick={() => handleImagePopupOpenClick(activityDetailData.bannerImageUrl)}
            >
              <Image
                className={cn('image', { visible: imageLoading.banner })}
                src={activityDetailData.bannerImageUrl}
                alt={activityDetailData.title}
                sizes={'100%'}
                fill
                priority
                onLoad={() => setImageLoading((prev) => ({ ...prev, banner: false }))}
              />
            </div>
            {!subImageEnable && (
              <div
                className={cn(
                  'image-field-sub',
                  { 'grid-pattern1': activityDetailData.subImages.length === 1 },
                  { 'grid-pattern2': activityDetailData.subImages.length === 2 },
                  { 'grid-pattern3': activityDetailData.subImages.length === 3 }
                )}
              >
                {activityDetailData.subImages.map(
                  (image, index) =>
                    image.imageUrl && (
                      <div
                        key={image.id}
                        className={cn(
                          { 'sub-image': !imageLoading.subImage[index] },
                          { subImageLoading: imageLoading.subImage[index] }
                        )}
                        onClick={() => handleImagePopupOpenClick(image.imageUrl)}
                      >
                        <Image
                          className={cn('image', { visible: imageLoading.subImage[index] })}
                          src={image.imageUrl}
                          alt={'서브 이미지'}
                          sizes={'100%'}
                          fill
                          priority
                          onLoad={() =>
                            setImageLoading((prev) => ({ ...prev, subImage: { ...prev.subImage, [index]: false } }))
                          }
                        />
                      </div>
                    )
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
