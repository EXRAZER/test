import { useEffect, useRef } from 'react';

const InputField = (props) => {
    const ref = useRef(null);
    const { onClickOutside, children } = props;
  
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (ref.current && !ref.current.contains(event.target)) {
          onClickOutside && onClickOutside();
        }
      };
      document.addEventListener('click', handleClickOutside, true);
      return () => {
        document.removeEventListener('click', handleClickOutside, true);
      };
    }, [ onClickOutside ]);
  
    if(!props.show)
      return null;
  
    return (
      <div ref={ref} className='absolute z-10 bg-white divide-y divide-gray-100 rounded-lg shadow-xl border border-gray-200 w-[20%] min-w-[200px]'>
          {children}
      </div> );


}

export default InputField