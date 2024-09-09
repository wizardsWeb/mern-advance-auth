import React from 'react'
import { motion } from 'framer-motion';

const FloatingShape = ({ color, size, top, left, delay }) => {

  // console.log(top)

  return (
    <motion.div className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`} 
     
     style={{left, top}}

     animate={{
        x: ["0%", "100%", "0%"],
        y: ["0%", "100%", "0%"],
        rotate: [0, 360],
     }}
     transition={{
        duration: 20,
         
        repeat: Infinity,
        delay,
     }}

     area-hidden='true'

    />
  )
}

export default FloatingShape
