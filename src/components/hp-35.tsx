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
    if (entering) {
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
        result = Math.sin(stack.x)
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "cos":
        result = Math.cos(stack.x)
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "tan":
        result = Math.tan(stack.x)
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
      case "CHS":
        result = -stack.x
        setStack((prev) => ({ ...prev, x: result }))
        break
      case "x↔y":
        setStack((prev) => ({ ...prev, x: prev.y, y: prev.x }))
        result = stack.y
        break
    }

    setDisplay(updateDisplay(result))
    setEntering(false)
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

        {/* Button Grid */}
        <div className="grid grid-cols-5 gap-2">
          {/* Row 1 - Scientific Functions */}
          <Button onClick={() => operation("x^y")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">x<sup>y</sup></Button>
          <Button onClick={() => operation("log")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">log</Button>
          <Button onClick={() => operation("ln")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">ln</Button>
          <Button onClick={() => operation("e^x")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">e<sup>x</sup></Button>
          <Button onClick={clear} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">CLR</Button>

          {/* Row 2 */}
          <Button onClick={() => operation("√x")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">√x</Button>
          <Button className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">arc</Button>
          <Button onClick={() => operation("sin")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">sin</Button>
          <Button onClick={() => operation("cos")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">cos</Button>
          <Button onClick={() => operation("tan")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">tan</Button>

          {/* Row 3 */}
          <Button onClick={() => operation("1/x")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">1/x</Button>
          <Button onClick={() => operation("x↔y")} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">x↔y</Button>
          <Button className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">R↓</Button>
          <Button onClick={store} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">STO</Button>
          <Button onClick={recall} className="bg-gradient-to-b from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white text-xs font-bold h-10 rounded border border-gray-600 active:scale-95 transition-transform">RCL</Button>

          {/* Row 4 */}
          <Button onClick={enter} className="col-span-2 bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-sm font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">ENTER↑</Button>
          <Button onClick={() => operation("CHS")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">CHS</Button>
          <Button className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">EEX</Button>
          <Button className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-xs font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">CLx</Button>
          <div></div>

          {/* Row 5 */}
          <Button onClick={() => operation("-")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">-</Button>
          <Button onClick={() => inputDigit("7")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">7</Button>
          <Button onClick={() => inputDigit("8")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">8</Button>
          <Button onClick={() => inputDigit("9")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">9</Button>
          <div></div>

          {/* Row 6 */}
          <Button onClick={() => operation("+")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">+</Button>
          <Button onClick={() => inputDigit("4")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">4</Button>
          <Button onClick={() => inputDigit("5")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">5</Button>
          <Button onClick={() => inputDigit("6")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">6</Button>
          <div></div>

          {/* Row 7 */}
          <Button onClick={() => operation("×")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">×</Button>
          <Button onClick={() => inputDigit("1")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">1</Button>
          <Button onClick={() => inputDigit("2")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">2</Button>
          <Button onClick={() => inputDigit("3")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">3</Button>
          <div></div>

          {/* Row 8 */}
          <Button onClick={() => operation("÷")} className="bg-gradient-to-b from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white text-lg font-bold h-10 rounded border border-blue-400 active:scale-95 transition-transform">÷</Button>
          <Button onClick={() => inputDigit("0")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">0</Button>
          <Button onClick={inputDecimal} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">.</Button>
          <Button onClick={() => inputDigit("π")} className="bg-gradient-to-b from-gray-100 to-gray-200 hover:from-white hover:to-gray-100 text-black text-lg font-bold h-10 rounded border border-gray-300 active:scale-95 transition-transform">π</Button>
          <div></div>
        </div>

        {/* HP Branding */}
        <div className="mt-4 text-center">
          <div className="text-gray-300 text-xs font-bold tracking-wider">HEWLETT-PACKARD</div>
        </div>
      </div>
    </div>
  )
}
