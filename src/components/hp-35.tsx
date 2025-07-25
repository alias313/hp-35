"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface StackState {
  x: number
  y: number
  z: number
  t: number
}

export default function Component() {
  const [stack, setStack] = useState<StackState>({ x: 0, y: 0, z: 0, t: 0 })
  const [display, setDisplay] = useState("0")
  const [entering, setEntering] = useState(false)
  const [memory, setMemory] = useState(0)
  const [eexActive, setEexActive] = useState(false)
  const [eexMantissa, setEexMantissa] = useState(0)
  const [eexExponent, setEexExponent] = useState(0)
  const [eexSign, setEexSign] = useState(1)
  const [arcActive, setArcActive] = useState(false)

  const updateDisplay = (value: number) => {
    if (value === 0) return "0"
    if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-9 && value !== 0)) {
      return value.toExponential(6)
    }
    return value.toString().slice(0, 10)
  }

  const pushStack = (newX: number) => {
    setStack((prev) => ({
      t: prev.z,
      z: prev.y,
      y: prev.x,
      x: newX,
    }))
    setDisplay(updateDisplay(newX))
  }

  const inputDigit = (digit: string) => {
    if (digit === "π") {
      setDisplay(Math.PI.toString().slice(0, 10))
      setStack((prev) => ({ ...prev, x: Math.PI }))
      setEntering(false)
      setEexActive(false)
      return
    }
    if (eexActive) {
      // Entering exponent
      let newExp = Math.abs(eexExponent) * 10 + Number(digit)
      newExp = eexSign < 0 ? -newExp : newExp
      setEexExponent(newExp)
      setDisplay(`${eexMantissa}e${newExp}`)
      setStack((prev) => ({ ...prev, x: eexMantissa * Math.pow(10, newExp) }))
    } else if (entering) {
      const newDisplay = display === "0" ? digit : display + digit
      if (newDisplay.length <= 10) {
        setDisplay(newDisplay)
        setStack((prev) => ({ ...prev, x: Number.parseFloat(newDisplay) }))
      }
    } else {
      setDisplay(digit)
      setStack((prev) => ({ ...prev, x: Number.parseFloat(digit) }))
      setEntering(true)
    }
  }

  const inputDecimal = () => {
    if (entering) {
      if (!display.includes(".")) {
        const newDisplay = display + "."
        setDisplay(newDisplay)
      }
    } else {
      setDisplay("0.")
      setEntering(true)
    }
  }

  const enter = () => {
    pushStack(stack.x)
    setEntering(false)
  }

  const operation = (op: string) => {
    let result = stack.x

    switch (op) {
      case "+":
        result = stack.y + stack.x
        setStack((prev) => ({ ...prev, x: result, y: prev.z, z: prev.t, t: 0 }))
        break
      case "-":
        result = stack.y - stack.x
        setStack((prev) => ({ ...prev, x: result, y: prev.z, z: prev.t, t: 0 }))
        break
      case "×":
        result = stack.y * stack.x
        setStack((prev) => ({ ...prev, x: result, y: prev.z, z: prev.t, t: 0 }))
        break
      case "÷":
        result = stack.y / stack.x
        setStack((prev) => ({ ...prev, x: result, y: prev.z, z: prev.t, t: 0 }))
        break
      case "x^y":
        result = Math.pow(stack.y, stack.x)
        setStack((prev) => ({ ...prev, x: result, y: prev.z, z: prev.t, t: 0 }))
        break
      case "√x":
        result = Math.sqrt(stack.x)
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "1/x":
        result = 1 / stack.x
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "sin":
        if (arcActive) {
          result = Math.asin(stack.x)
          console.log(result);
          setArcActive(false)
        } else {
          result = Math.sin(stack.x)
        }
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "cos":
        if (arcActive) {
          result = Math.acos(stack.x)
          setArcActive(false)
        } else {
          result = Math.cos(stack.x)
        }
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "tan":
        if (arcActive) {
          result = Math.atan(stack.x)
          setArcActive(false)
        } else {
          result = Math.tan(stack.x)
        }
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "log":
        result = Math.log10(stack.x)
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "ln":
        result = Math.log(stack.x)
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "e^x":
        result = Math.exp(stack.x)
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "EEX":
        setEexActive(true)
        setEexMantissa(stack.x)
        setEexExponent(0)
        setEexSign(1)
        setDisplay(`${stack.x}e`)
        setEntering(false)
        return
      case "CHS":
        if (eexActive) {
          setEexSign((prev) => -prev)
          setEexExponent((prev) => -prev)
          setDisplay(`${eexMantissa}e${-eexExponent}`)
          return
        }
        result = -stack.x
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "x↔y":
        setStack((prev) => ({ ...prev, x: prev.y, y: prev.x }))
        result = stack.y
        break
      case "arc":
        setArcActive(true)
        return
    }

    setDisplay(updateDisplay(result))
    setEntering(false)
    setEexActive(false)
  }

  const clear = () => {
    setStack({ x: 0, y: 0, z: 0, t: 0 })
    setDisplay("0")
    setEntering(false)
  }

  const store = () => {
    setMemory(stack.x)
  }

  const recall = () => {
    pushStack(memory)
    setEntering(false)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-300 to-slate-400 p-4">
      <div className="bg-gradient-to-b from-slate-600 to-slate-800 p-6 rounded-2xl shadow-2xl border-4 border-slate-500 max-w-sm">
        {/* LED Display */}
        <div className="bg-black rounded-lg p-4 mb-6 border-2 border-gray-700 shadow-inner">
          <div className="bg-gradient-to-b from-red-900 to-black p-3 rounded border border-red-800">
            <div className="text-red-500 font-mono text-2xl font-bold tracking-wider text-right min-h-[32px] flex items-center justify-end filter brightness-150">
              {display}
            </div>
          </div>
        </div>

        {/* Top 4 rows: 5-column grid for functions */}
        <div className="grid grid-cols-5 gap-2 mb-4">
          <Button onMouseDown={() => operation("x^y")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">x<sup>y</sup></Button>
          <Button onMouseDown={() => operation("log")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">log</Button>
          <Button onMouseDown={() => operation("ln")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">ln</Button>
          <Button onMouseDown={() => operation("e^x")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">e<sup>x</sup></Button>
          <Button onMouseDown={clear} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">CLR</Button>

          <Button onMouseDown={() => operation("√x")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">√x</Button>
          <Button onMouseDown={() => operation("arc")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">arc</Button>
          <Button onMouseDown={() => operation("sin")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">sin</Button>
          <Button onMouseDown={() => operation("cos")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">cos</Button>
          <Button onMouseDown={() => operation("tan")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">tan</Button>

          <Button onMouseDown={() => operation("1/x")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">1/x</Button>
          <Button onMouseDown={() => operation("x↔y")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">x↔y</Button>
          <Button className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">R↓</Button>
          <Button onMouseDown={store} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">STO</Button>
          <Button onMouseDown={recall} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">RCL</Button>

          {/* Row 4: ENTER spans columns 1-2, then CHS, EEX, CLx */}
          <Button onMouseDown={enter} className="col-span-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">ENTER↑</Button>
          <Button onMouseDown={() => operation("CHS")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">CHS</Button>
          <Button onMouseDown={() => operation("EEX")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">EEX</Button>
          <Button className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">CLx</Button>
        </div>

        {/* Bottom section: 4x4 grid for operators and number pad */}
        <div className="grid grid-cols-4 gap-2">
          {/* Row 1: - operator, 7, 8, 9 */}
          <Button onMouseDown={() => operation("-")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-12 rounded border border-blue-400 active:scale-95 transition-transform">-</Button>
          <Button onMouseDown={() => inputDigit("7")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">7</Button>
          <Button onMouseDown={() => inputDigit("8")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">8</Button>
          <Button onMouseDown={() => inputDigit("9")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">9</Button>

          {/* Row 2: + operator, 4, 5, 6 */}
          <Button onMouseDown={() => operation("+")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-12 rounded border border-blue-400 active:scale-95 transition-transform">+</Button>
          <Button onMouseDown={() => inputDigit("4")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">4</Button>
          <Button onMouseDown={() => inputDigit("5")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">5</Button>
          <Button onMouseDown={() => inputDigit("6")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">6</Button>

          {/* Row 3: × operator, 1, 2, 3 */}
          <Button onMouseDown={() => operation("×")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-12 rounded border border-blue-400 active:scale-95 transition-transform">×</Button>
          <Button onMouseDown={() => inputDigit("1")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">1</Button>
          <Button onMouseDown={() => inputDigit("2")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">2</Button>
          <Button onMouseDown={() => inputDigit("3")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">3</Button>

          {/* Row 4: ÷ operator, 0, ., π */}
          <Button onMouseDown={() => operation("÷")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-12 rounded border border-blue-400 active:scale-95 transition-transform">÷</Button>
          <Button onMouseDown={() => inputDigit("0")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">0</Button>
          <Button onMouseDown={inputDecimal} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">.</Button>
          <Button onMouseDown={() => inputDigit("π")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-12 rounded border border-gray-300 active:scale-95 transition-transform">π</Button>
        </div>

        {/* HP Branding */}
        <div className="mt-4 text-center">
          <div className="text-gray-300 text-xs font-bold tracking-wider">HEWLETT-PACKARD</div>
        </div>
      </div>
      {/* RPN Example in background */}
      <div className="absolute bottom-8 left-0 w-full flex justify-center pointer-events-none">
        <div className="bg-transparent text-gray-700 text-xs text-center pointer-events-auto">
          Example: To calculate <span className="font-mono">3 + 4</span>: <span className="font-mono">3 ENTER 4 +</span>
        </div>
      </div>
    </div>
  )
}
