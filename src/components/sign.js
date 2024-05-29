import React, { useRef, useEffect, useMemo } from 'react';
import { Image } from 'react-konva';
import { useImage } from 'react-konva-utils';

const Sign = ({ x, y, width, height }) => {
    const [image] = useImage('placa.png');
    const signRef = useRef();

    useEffect(() => {
        if (signRef.current) {
            signRef.current.cache();
        }
    }, [image]);

    return (
    <Image image={image} x={x} y={y} width={50} height={50} ref={signRef} />
    );
};

export default Sign;
