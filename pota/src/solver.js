import { loadPyodide } from 'pyodide';

// Singleton Pyodide instance
let pyodideInstance = null;
let pyodidePromise = null;

// Load Pyodide and SymPy once
const loadPyodideInstance = async () => {
  if (pyodideInstance) return pyodideInstance;
  if (pyodidePromise) return pyodidePromise;
  
  pyodidePromise = (async () => {
    console.log('Loading Pyodide...');
    const pyodide = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.2/full/'
    });
    
    console.log('Installing SymPy...');
    await pyodide.loadPackage('sympy');
    
    // Load the Python solver code from file
    console.log('Loading solve.py...');
    const response = await fetch('./solve.py');
    const pythonCode = await response.text();
    await pyodide.runPythonAsync(pythonCode);
    
    console.log('Pyodide ready!');
    pyodideInstance = pyodide;
    return pyodide;
  })();
  
  return pyodidePromise;
};

/**
 * Get detailed solution for an equation
 * @param {string} equationStr - Equation like "x = 1/(x) + 1 + x"
 * @returns {Promise<{has_positive_roots: boolean, solutions: string[], float_values: number[]}>}
 */
export const solveEquation = async (equationStr) => {
  const pyodide = await loadPyodideInstance();
  
  try {
    const result = pyodide.runPython(`
import json
json.dumps(solve_equation(${JSON.stringify(equationStr)}))
    `);
    
    return JSON.parse(result);
  } catch (error) {
    console.error('Error solving equation:', equationStr, error);
    return { has_positive_roots: false, error: error.message };
  }
};
