export default Page

import React, { useId } from 'react'
import { uneval } from 'devalue'
const date = new Date('2024-01-01 00:00+07:00')

function Page() {
  return (
    <>
      {/* <h1>{date.toLocaleString()}</h1> */}
      <DateTime date={date} format={(date) => date.toLocaleString()} />
    </>
  )
}

const DateTime = ({ date, format }: { date: Date; format: (date: Date) => string }) => {
  const key = useId()
  const id = `__placeholder__${key}`
  const idScript = `__placeholder__${key}__script`
  const allFormattedDates: { [key: string]: string } = {}
  const localOffsetHours = -(new Date().getTimezoneOffset() / 60).toFixed(1)
  let localFormattedDate: string
  if (import.meta.env.SSR) {
    const allOfsetsHours = [
      +0.0, +1.0, +2.0, +3.0, +3.5, +4.0, +4.5, +5.5, +5.75, +6.0, +6.5, +7.0, +8.0, +8.75, +9.0, +9.5, +10.0, +10.5,
      +11.0, +12.0, +12.75, +13.0, +13.75, +14.0, -1.0, -2.0, -2.5, -3.0, -3.5, -4.0, -4.5, -5.0, -6.0, -7.0, -8.0,
      -9.0, -9.5, -10.0, -11.0, -12.0
    ]
    for (const offsetHours of allOfsetsHours) {
      allFormattedDates[offsetHours] = format(
        new Date(date.getTime() + (offsetHours - localOffsetHours) * 60 * 60 * 1000)
      ).replaceAll('\u202F', ' ')
    }
    localFormattedDate = allFormattedDates[localOffsetHours]
  } else {
    //@ts-ignore
    localFormattedDate = window[`localFormattedDate${key}`]
  }

  return (
    <>
      <div id={id}>{localFormattedDate}</div>
      <script
        id={idScript}
        dangerouslySetInnerHTML={{
          __html: import.meta.env.SSR
            ? `
            {
              const allFormattedDates = ${uneval(allFormattedDates)};
              const localOffsetHours = -(new Date().getTimezoneOffset() / 60).toFixed(1);
              const localFormattedDate = allFormattedDates[localOffsetHours];
              window['localFormattedDate${key}'] = localFormattedDate;
              document.getElementById('${id}').innerHTML = localFormattedDate;
              document.getElementById('${idScript}').innerHTML= '';
            }
          `
            : ''
        }}
      ></script>
    </>
  )
}
