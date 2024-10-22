import Image, { ImageProps } from 'next/image';
import React, { FC } from 'react';
import { getBase64 } from '@/lib/getBase64';
import { cn } from '@/lib/utils';

interface IProps extends ImageProps {}
export const CustomImage: FC<IProps> = async ({ src, alt, className, ...rest }) => {
    const base64 = await getBase64(String(src));
    return (
        <>
            {rest.placeholder === 'blur' ? (
                <Image
                    src={src}
                    alt={alt}
                    {...rest}
                    width={500}
                    height={500}
                    blurDataURL={base64}
                    className={cn(`object-cover`, className)}
                />
            ) : (
                <Image src={src} alt={alt} {...rest} className={cn(`object-cover`, className)} />
            )}
        </>
    );
};
