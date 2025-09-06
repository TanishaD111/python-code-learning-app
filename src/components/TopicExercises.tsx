import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { CheckCircle, Circle, Star } from 'lucide-react';

interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  xpReward: number;
  startingCode: string;
  solution: string;
  hint: string;
}

interface TopicExercisesProps {
  topic: string;
  completedExercises: string[];
  onStartExercise: (exercise: Exercise) => void;
}

const exerciseData: { [key: string]: Exercise[] } = {
  'data-types-variables': [
    {
      id: 'dt-1',
      title: 'Your First Variable',
      description: 'Create a string variable with your name and print it.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Create a variable called name\n# Set it to your name (use quotes)\n# Print the variable\n',
      solution: 'name = "Your Name"\nprint(name)',
      hint: 'Use quotes around text values and the print() function'
    },
    {
      id: 'dt-2',
      title: 'Number Variables',
      description: 'Create integer and float variables, then print them.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Create an integer variable age\n# Create a float variable height\n# Print both variables\n',
      solution: 'age = 13\nheight = 5.2\nprint(age)\nprint(height)',
      hint: 'Integers are whole numbers, floats have decimal points'
    },
    {
      id: 'dt-3',
      title: 'Boolean Variables',
      description: 'Create boolean variables and understand True/False values.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Create a boolean variable is_student set to True\n# Create another boolean is_teacher set to False\n# Print both\n',
      solution: 'is_student = True\nis_teacher = False\nprint(is_student)\nprint(is_teacher)',
      hint: 'Boolean values are True or False (note the capital letters)'
    },
    {
      id: 'dt-4',
      title: 'String Variable Practice',
      description: 'Create variables for first name, last name, and favorite color.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Create variables for first_name, last_name, and favorite_color\n# Print all three variables\n',
      solution: 'first_name = "Alex"\nlast_name = "Smith"\nfavorite_color = "blue"\nprint(first_name)\nprint(last_name)\nprint(favorite_color)',
      hint: 'Remember to use quotes for strings and meaningful variable names'
    },
    {
      id: 'dt-5',
      title: 'Integer Operations',
      description: 'Create variables for your birth year and current year, calculate your age.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Create birth_year and current_year variables\n# Calculate and print your age\n',
      solution: 'birth_year = 2010\ncurrent_year = 2024\nage = current_year - birth_year\nprint(age)',
      hint: 'Subtract birth year from current year to get age'
    },
    {
      id: 'dt-6',
      title: 'Float Calculations',
      description: 'Create variables for temperature in Celsius, convert to Fahrenheit.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Create celsius variable (e.g., 25.0)\n# Convert to fahrenheit: F = C * 9/5 + 32\n# Print both temperatures\n',
      solution: 'celsius = 25.0\nfahrenheit = celsius * 9/5 + 32\nprint(celsius)\nprint(fahrenheit)',
      hint: 'Use the formula F = C * 9/5 + 32 for conversion'
    },
    {
      id: 'dt-7',
      title: 'Boolean Logic Practice',
      description: 'Create boolean variables for weather conditions and combine them.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Create is_sunny, is_warm, is_weekend boolean variables\n# Print each variable\n',
      solution: 'is_sunny = True\nis_warm = False\nis_weekend = True\nprint(is_sunny)\nprint(is_warm)\nprint(is_weekend)',
      hint: 'Boolean values are either True or False (capitalized)'
    },
    {
      id: 'dt-8',
      title: 'Multiple Data Types',
      description: 'Create variables of different types and print their types using type().',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Create a string, integer, float, and boolean variable\n# Print each variable and its type using type()\n',
      solution: 'name = "Python"\nage = 15\nheight = 5.7\nis_fun = True\nprint(name, type(name))\nprint(age, type(age))\nprint(height, type(height))\nprint(is_fun, type(is_fun))',
      hint: 'Use type(variable_name) to see the data type'
    },
    {
      id: 'dt-9',
      title: 'Variable Reassignment',
      description: 'Create a variable and change its value multiple times.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Create a variable x with value 10\n# Change x to 20, then to 30\n# Print x after each change\n',
      solution: 'x = 10\nprint(x)\nx = 20\nprint(x)\nx = 30\nprint(x)',
      hint: 'You can reassign variables by using the same variable name with ='
    },
    {
      id: 'dt-10',
      title: 'String Formatting',
      description: 'Use f-strings to format variables into sentences.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'name = "Alice"\nage = 14\ngrade = 8\n# Use f-strings to create a formatted sentence\n',
      solution: 'name = "Alice"\nage = 14\ngrade = 8\nsentence = f"My name is {name}, I am {age} years old and in grade {grade}"\nprint(sentence)',
      hint: 'Use f"text {variable}" to insert variables into strings'
    },
    {
      id: 'dt-11',
      title: 'None Data Type',
      description: 'Learn about the None data type and how to use it.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Create a variable set to None\n# Print the variable and its type\n# Check if the variable is None\n',
      solution: 'empty_var = None\nprint(empty_var)\nprint(type(empty_var))\nprint(empty_var is None)',
      hint: 'None represents the absence of a value. Use "is" to check for None'
    },
    {
      id: 'dt-12',
      title: 'Multiple Assignment',
      description: 'Assign multiple variables in one line.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Assign x=1, y=2, z=3 in one line\n# Print all three variables\n',
      solution: 'x, y, z = 1, 2, 3\nprint(x)\nprint(y)\nprint(z)',
      hint: 'Use commas to separate multiple variables and values: a, b = 1, 2'
    },
    {
      id: 'dt-13',
      title: 'Variable Naming Rules',
      description: 'Practice proper variable naming conventions.',
      difficulty: 'Intermediate',
      xpReward: 12,
      startingCode: '# Create variables following Python naming conventions\n# student_name, total_score, is_passing\n# Assign appropriate values and print them\n',
      solution: 'student_name = "John Doe"\ntotal_score = 95\nis_passing = True\nprint(student_name)\nprint(total_score)\nprint(is_passing)',
      hint: 'Use snake_case (underscores) for variable names in Python'
    },
    {
      id: 'dt-14',
      title: 'Constants Practice',
      description: 'Create constant variables (conventionally uppercase).',
      difficulty: 'Intermediate',
      xpReward: 12,
      startingCode: '# Create constants: PI, MAX_SPEED, COMPANY_NAME\n# Print all constants\n',
      solution: 'PI = 3.14159\nMAX_SPEED = 100\nCOMPANY_NAME = "TechCorp"\nprint(PI)\nprint(MAX_SPEED)\nprint(COMPANY_NAME)',
      hint: 'Constants are written in UPPERCASE by convention'
    },
    {
      id: 'dt-15',
      title: 'Dynamic Typing',
      description: 'Demonstrate how Python variables can change types.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Create variable x as integer, then string, then boolean\n# Print x and its type after each assignment\n',
      solution: 'x = 42\nprint(x, type(x))\nx = "Hello"\nprint(x, type(x))\nx = True\nprint(x, type(x))',
      hint: 'Python allows variables to change types during execution'
    },
    {
      id: 'dt-16',
      title: 'Global vs Local Concept',
      description: 'Understanding variable scope basics.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Create a global variable outside any function\nglobal_var = "I am global"\nprint(global_var)\n',
      solution: 'global_var = "I am global"\nprint(global_var)\n\ndef show_local():\n    local_var = "I am local"\n    print(local_var)\n    print(global_var)\n\nshow_local()',
      hint: 'Global variables can be accessed anywhere, local variables only within their function'
    },
    {
      id: 'dt-17',
      title: 'Memory Address',
      description: 'Use id() to see memory addresses of variables.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Create two variables with same value\n# Print their memory addresses using id()\n# Compare if they reference the same object\n',
      solution: 'a = 100\nb = 100\nprint(id(a))\nprint(id(b))\nprint(a is b)',
      hint: 'id() shows memory address, "is" checks if variables reference the same object'
    },
    {
      id: 'dt-18',
      title: 'Variable Unpacking',
      description: 'Unpack values from a tuple into variables.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: '# Create a tuple with three values\n# Unpack them into separate variables\n# Print each variable\n',
      solution: 'coordinates = (10, 20, 30)\nx, y, z = coordinates\nprint(x)\nprint(y)\nprint(z)',
      hint: 'Use tuple unpacking: x, y, z = (1, 2, 3)'
    },
    {
      id: 'dt-19',
      title: 'Variable Swapping',
      description: 'Swap values between variables using Python\'s elegant syntax.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: 'a = 10\nb = 20\n# Swap the values of a and b in one line\n# Print both variables\n',
      solution: 'a = 10\nb = 20\nprint("Before:", a, b)\na, b = b, a\nprint("After:", a, b)',
      hint: 'Python allows elegant swapping: a, b = b, a'
    },
    {
      id: 'dt-20',
      title: 'Complex Variable Operations',
      description: 'Combine multiple data types in complex expressions.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: '# Create variables: name, age, gpa, is_honor_student\n# Create a complex f-string combining all variables\n# Print the result\n',
      solution: 'name = "Sarah"\nage = 16\ngpa = 3.8\nis_honor_student = True\nresult = f"{name} is {age} years old with a GPA of {gpa}. Honor student: {is_honor_student}"\nprint(result)',
      hint: 'Use f-strings to combine multiple variable types in one formatted string'
    }
  ],
  'printing-strings': [
    {
      id: 'print-1',
      title: 'Hello World',
      description: 'Print your first message to the screen.',
      difficulty: 'Beginner',
      xpReward: 8,
      startingCode: '# Print "Hello, World!" to the screen\n',
      solution: 'print("Hello, World!")',
      hint: 'Use the print() function with quotes around the text'
    },
    {
      id: 'print-2',
      title: 'Print Multiple Lines',
      description: 'Print three different messages on separate lines.',
      difficulty: 'Beginner',
      xpReward: 8,
      startingCode: '# Print "Welcome to Python", "Let\'s learn together", and "Have fun!" on separate lines\n',
      solution: 'print("Welcome to Python")\nprint("Let\'s learn together")\nprint("Have fun!")',
      hint: 'Use separate print() statements for each line'
    },
    {
      id: 'print-3',
      title: 'Print Variables',
      description: 'Create variables and print them.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: 'message = "Python is awesome!"\nnumber = 42\n# Print both variables\n',
      solution: 'message = "Python is awesome!"\nnumber = 42\nprint(message)\nprint(number)',
      hint: 'Variables don\'t need quotes when printing'
    },
    {
      id: 'print-4',
      title: 'Print with Quotes',
      description: 'Print text that contains quotation marks.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Print: She said "Hello there!"\n',
      solution: 'print("She said \\"Hello there!\\"")',
      hint: 'Use \\" to include quotes inside a string'
    },
    {
      id: 'print-5',
      title: 'String Concatenation',
      description: 'Combine two strings using the + operator.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: 'first_name = "John"\nlast_name = "Doe"\n# Combine them with a space and print the full name\n',
      solution: 'first_name = "John"\nlast_name = "Doe"\nfull_name = first_name + " " + last_name\nprint(full_name)',
      hint: 'Use + to join strings, don\'t forget the space in between'
    },
    {
      id: 'print-6',
      title: 'Multiple Items in Print',
      description: 'Print multiple items separated by commas.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: 'name = "Alice"\nage = 15\n# Print both in one print statement separated by comma\n',
      solution: 'name = "Alice"\nage = 15\nprint(name, age)',
      hint: 'Use commas in print() to separate multiple items'
    },
    {
      id: 'print-7',
      title: 'Print with Custom Separator',
      description: 'Use the sep parameter in print() to customize separators.',
      difficulty: 'Intermediate',
      xpReward: 12,
      startingCode: '# Print "apple", "banana", "cherry" separated by " - "\n',
      solution: 'print("apple", "banana", "cherry", sep=" - ")',
      hint: 'Use sep=" - " as a parameter in print()'
    },
    {
      id: 'print-8',
      title: 'Print Without Newline',
      description: 'Use the end parameter to print without a newline.',
      difficulty: 'Intermediate',
      xpReward: 12,
      startingCode: '# Print "Loading" followed by three dots, each on the same line\n',
      solution: 'print("Loading", end="")\nprint(".", end="")\nprint(".", end="")\nprint(".")',
      hint: 'Use end="" to prevent print from adding a newline'
    },
    {
      id: 'print-9',
      title: 'Type Casting to String',
      description: 'Convert numbers to strings and combine with text.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'age = 14\n# Create a message like "I am 14 years old"\n# Convert age to string first\n',
      solution: 'age = 14\nmessage = "I am " + str(age) + " years old"\nprint(message)',
      hint: 'Use str() to convert numbers to strings before concatenating'
    },
    {
      id: 'print-10',
      title: 'Boolean to String',
      description: 'Convert boolean values to strings.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'is_student = True\n# Print "Student status: True" using string concatenation\n',
      solution: 'is_student = True\nprint("Student status: " + str(is_student))',
      hint: 'Use str() to convert boolean values to strings'
    },
    {
      id: 'print-11',
      title: 'F-String Basics',
      description: 'Use f-strings for easier string formatting.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'name = "Bob"\nage = 16\n# Use f-string to print "Hi, I\'m Bob and I\'m 16 years old"\n',
      solution: 'name = "Bob"\nage = 16\nprint(f"Hi, I\'m {name} and I\'m {age} years old")',
      hint: 'Use f"text {variable}" to insert variables into strings'
    },
    {
      id: 'print-12',
      title: 'F-String with Expressions',
      description: 'Include calculations inside f-strings.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'length = 5\nwidth = 3\n# Use f-string to print "Area: 15" (calculate length * width)\n',
      solution: 'length = 5\nwidth = 3\nprint(f"Area: {length * width}")',
      hint: 'You can include calculations inside {} in f-strings'
    },
    {
      id: 'print-13',
      title: 'Multi-line Strings',
      description: 'Create and print multi-line strings using triple quotes.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Create a multi-line string with triple quotes containing a poem\n# Print the multi-line string\n',
      solution: 'poem = """Roses are red,\nViolets are blue,\nPython is great,\nAnd so are you!"""\nprint(poem)',
      hint: 'Use triple quotes """ for multi-line strings'
    },
    {
      id: 'print-14',
      title: 'Escape Characters',
      description: 'Use escape characters like \\n, \\t in strings.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Print "Name:\\tJohn\\nAge:\\t25" with proper tab and newline formatting\n',
      solution: 'print("Name:\\tJohn\\nAge:\\t25")',
      hint: 'Use \\n for newline and \\t for tab character'
    },
    {
      id: 'print-15',
      title: 'String Formatting with .format()',
      description: 'Use the .format() method for string formatting.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: 'product = "laptop"\nprice = 999.99\n# Use .format() to print "The laptop costs $999.99"\n',
      solution: 'product = "laptop"\nprice = 999.99\nprint("The {} costs ${:.2f}".format(product, price))',
      hint: 'Use {} as placeholders and .format() to fill them'
    },
    {
      id: 'print-16',
      title: 'Advanced F-String Formatting',
      description: 'Format numbers and dates in f-strings.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: 'pi = 3.14159\nscore = 85\n# Print pi rounded to 2 decimals and score as percentage\n',
      solution: 'pi = 3.14159\nscore = 85\nprint(f"Pi: {pi:.2f}")\nprint(f"Score: {score}%")',
      hint: 'Use {variable:.2f} for 2 decimal places in f-strings'
    },
    {
      id: 'print-17',
      title: 'Raw Strings',
      description: 'Use raw strings to handle backslashes literally.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Print a file path: C:\\Users\\Name\\Documents using raw string\n',
      solution: 'print(r"C:\\Users\\Name\\Documents")',
      hint: 'Use r"" for raw strings where backslashes are treated literally'
    },
    {
      id: 'print-18',
      title: 'Print to File Concept',
      description: 'Understand how print can output to different destinations.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Print "Debug info" and "Normal output" \n# (In real code, you could use file parameter)\n',
      solution: 'print("Debug info")\nprint("Normal output")',
      hint: 'print() can output to console, files, or other destinations'
    },
    {
      id: 'print-19',
      title: 'Complex String Building',
      description: 'Build complex strings with multiple data types.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: 'name = "Emma"\ngrade = 90.5\nis_passing = True\ncourse = "Python"\n# Create one complex formatted string with all variables\n',
      solution: 'name = "Emma"\ngrade = 90.5\nis_passing = True\ncourse = "Python"\nprint(f"Student {name} scored {grade}% in {course}. Passing: {is_passing}")',
      hint: 'Combine all variables into one comprehensive f-string'
    },
    {
      id: 'print-20',
      title: 'Dynamic String Generation',
      description: 'Generate strings based on conditions and calculations.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: 'base_price = 100\ndiscount = 0.15\nquantity = 3\n# Calculate total and create descriptive output\n',
      solution: 'base_price = 100\ndiscount = 0.15\nquantity = 3\ndiscounted_price = base_price * (1 - discount)\ntotal = discounted_price * quantity\nprint(f"Item: ${base_price} each")\nprint(f"Discount: {discount*100}%")\nprint(f"Price after discount: ${discounted_price}")\nprint(f"Quantity: {quantity}")\nprint(f"Total: ${total}")',
      hint: 'Break down the problem: calculate discounted price, then total, then format output'
    }
  ],
  'math-input-comparison': [
    {
      id: 'math-1',
      title: 'Basic Addition',
      description: 'Add two numbers and print the result.',
      difficulty: 'Beginner',
      xpReward: 8,
      startingCode: '# Add 15 and 27, print the result\n',
      solution: 'result = 15 + 27\nprint(result)',
      hint: 'Use the + operator for addition'
    },
    {
      id: 'math-2',
      title: 'Basic Subtraction',
      description: 'Subtract two numbers and print the result.',
      difficulty: 'Beginner',
      xpReward: 8,
      startingCode: '# Subtract 12 from 30, print the result\n',
      solution: 'result = 30 - 12\nprint(result)',
      hint: 'Use the - operator for subtraction'
    },
    {
      id: 'math-3',
      title: 'Basic Multiplication',
      description: 'Multiply two numbers and print the result.',
      difficulty: 'Beginner',
      xpReward: 8,
      startingCode: '# Multiply 8 and 7, print the result\n',
      solution: 'result = 8 * 7\nprint(result)',
      hint: 'Use the * operator for multiplication'
    },
    {
      id: 'math-4',
      title: 'Basic Division',
      description: 'Divide two numbers and print the result.',
      difficulty: 'Beginner',
      xpReward: 8,
      startingCode: '# Divide 56 by 8, print the result\n',
      solution: 'result = 56 / 8\nprint(result)',
      hint: 'Use the / operator for division'
    },
    {
      id: 'math-5',
      title: 'All Four Operations',
      description: 'Use +, -, *, / operators with numbers.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: 'a = 20\nb = 4\n# Print the sum, difference, product, and quotient\n',
      solution: 'a = 20\nb = 4\nprint(a + b)\nprint(a - b)\nprint(a * b)\nprint(a / b)',
      hint: 'Use +, -, *, and / for addition, subtraction, multiplication, and division'
    },
    {
      id: 'math-6',
      title: 'Integer Division',
      description: 'Use floor division (//) to get integer results.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Divide 17 by 3 using floor division, print the result\n',
      solution: 'result = 17 // 3\nprint(result)',
      hint: 'Use // for floor division (integer division)'
    },
    {
      id: 'math-7',
      title: 'Modulo Operation',
      description: 'Use the modulo operator (%) to find remainders.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Find the remainder when 17 is divided by 3\n',
      solution: 'result = 17 % 3\nprint(result)',
      hint: 'Use % to find the remainder of division'
    },
    {
      id: 'math-8',
      title: 'Exponentiation',
      description: 'Use ** for raising numbers to powers.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Calculate 2 to the power of 5\n',
      solution: 'result = 2 ** 5\nprint(result)',
      hint: 'Use ** for exponentiation (power operation)'
    },
    {
      id: 'math-9',
      title: 'Getting User Input',
      description: 'Ask the user for their name and greet them.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Ask user for their name\n# Print a greeting with their name\n',
      solution: 'name = input("What is your name? ")\nprint("Hello, " + name + "!")',
      hint: 'Use input() to get user input as a string'
    },
    {
      id: 'math-10',
      title: 'Input Number Conversion',
      description: 'Get a number from user input and convert it.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Ask user for their age, convert to integer, print it\n',
      solution: 'age_str = input("Enter your age: ")\nage = int(age_str)\nprint("You are", age, "years old")',
      hint: 'Use int() to convert string input to integer'
    },
    {
      id: 'math-11',
      title: 'Simple Calculator',
      description: 'Get two numbers from user and add them.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Get two numbers from user, convert to int, add and print result\n',
      solution: 'num1 = int(input("Enter first number: "))\nnum2 = int(input("Enter second number: "))\nresult = num1 + num2\nprint("Sum:", result)',
      hint: 'Get input, convert with int(), then add the numbers'
    },
    {
      id: 'math-12',
      title: 'Comparison: Equal',
      description: 'Compare two numbers using the == operator.',
      difficulty: 'Intermediate',
      xpReward: 12,
      startingCode: 'a = 10\nb = 10\n# Check if a equals b, print the result\n',
      solution: 'a = 10\nb = 10\nprint(a == b)',
      hint: 'Use == to check if two values are equal'
    },
    {
      id: 'math-13',
      title: 'Comparison: Not Equal',
      description: 'Compare two numbers using the != operator.',
      difficulty: 'Intermediate',
      xpReward: 12,
      startingCode: 'x = 15\ny = 20\n# Check if x is not equal to y, print the result\n',
      solution: 'x = 15\ny = 20\nprint(x != y)',
      hint: 'Use != to check if two values are not equal'
    },
    {
      id: 'math-14',
      title: 'Comparison: Greater Than',
      description: 'Use >, <, >=, <= operators.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'score = 85\npasssing_grade = 70\n# Check if score is greater than passing grade\n',
      solution: 'score = 85\npassing_grade = 70\nprint(score > passing_grade)',
      hint: 'Use > for greater than comparisons'
    },
    {
      id: 'math-15',
      title: 'All Comparison Operations',
      description: 'Compare numbers using all comparison operators.',
      difficulty: 'Intermediate',
      xpReward: 18,
      startingCode: 'x = 15\ny = 10\n# Print results of x > y, x < y, x >= y, x <= y, x == y, x != y\n',
      solution: 'x = 15\ny = 10\nprint(x > y)\nprint(x < y)\nprint(x >= y)\nprint(x <= y)\nprint(x == y)\nprint(x != y)',
      hint: 'Use >, <, >=, <=, ==, != for different comparisons'
    },
    {
      id: 'math-16',
      title: 'Order of Operations',
      description: 'Understand operator precedence in mathematical expressions.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Calculate: 2 + 3 * 4 and (2 + 3) * 4\n# Print both results\n',
      solution: 'result1 = 2 + 3 * 4\nresult2 = (2 + 3) * 4\nprint(result1)\nprint(result2)',
      hint: 'Multiplication happens before addition unless parentheses change the order'
    },
    {
      id: 'math-17',
      title: 'Complex Mathematical Expression',
      description: 'Create complex expressions with multiple operators.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Calculate: (10 + 5) * 2 ** 3 - 15 // 4\n',
      solution: 'result = (10 + 5) * 2 ** 3 - 15 // 4\nprint(result)',
      hint: 'Follow order of operations: parentheses, exponents, multiplication/division, addition/subtraction'
    },
    {
      id: 'math-18',
      title: 'Float Input and Calculations',
      description: 'Work with decimal numbers from user input.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Get a decimal number from user, calculate its square\n',
      solution: 'num = float(input("Enter a decimal number: "))\nsquare = num ** 2\nprint(f"The square of {num} is {square}")',
      hint: 'Use float() to convert input to decimal number'
    },
    {
      id: 'math-19',
      title: 'Advanced Calculator',
      description: 'Create a calculator that handles multiple operations.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: '# Get two numbers and perform all basic operations\n# Display results nicely formatted\n',
      solution: 'a = float(input("Enter first number: "))\nb = float(input("Enter second number: "))\nprint(f"{a} + {b} = {a + b}")\nprint(f"{a} - {b} = {a - b}")\nprint(f"{a} * {b} = {a * b}")\nprint(f"{a} / {b} = {a / b}")',
      hint: 'Use float() for decimal numbers and f-strings for formatting'
    },
    {
      id: 'math-20',
      title: 'Real-World Math Problem',
      description: 'Solve a practical problem using multiple concepts.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: '# Calculate the cost of buying items with tax\n# price = 29.99, quantity = 3, tax_rate = 0.08\n# Show subtotal, tax, and total\n',
      solution: 'price = 29.99\nquantity = 3\ntax_rate = 0.08\n\nsubtotal = price * quantity\ntax = subtotal * tax_rate\ntotal = subtotal + tax\n\nprint(f"Price per item: ${price}")\nprint(f"Quantity: {quantity}")\nprint(f"Subtotal: ${subtotal:.2f}")\nprint(f"Tax: ${tax:.2f}")\nprint(f"Total: ${total:.2f}")',
      hint: 'Break it down: calculate subtotal, then tax, then total'
    }
  ],
  'boolean-conditionals': [
    {
      id: 'bool-1',
      title: 'Basic Boolean Values',
      description: 'Work with True and False values.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Create variables for is_sunny and is_raining\n# Set appropriate True/False values and print them\n',
      solution: 'is_sunny = True\nis_raining = False\nprint(is_sunny)\nprint(is_raining)',
      hint: 'Boolean values are True or False (note the capitalization)'
    },
    {
      id: 'bool-2',
      title: 'Boolean AND Operation',
      description: 'Use the "and" operator with boolean values.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: 'is_sunny = True\nis_warm = False\n# Use "and" to check if both are True\n',
      solution: 'is_sunny = True\nis_warm = False\nprint(is_sunny and is_warm)',
      hint: 'The "and" operator returns True only if both values are True'
    },
    {
      id: 'bool-3',
      title: 'Boolean OR Operation',
      description: 'Use the "or" operator with boolean values.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: 'is_weekend = True\nis_holiday = False\n# Use "or" to check if either is True\n',
      solution: 'is_weekend = True\nis_holiday = False\nprint(is_weekend or is_holiday)',
      hint: 'The "or" operator returns True if at least one value is True'
    },
    {
      id: 'bool-4',
      title: 'Boolean NOT Operation',
      description: 'Use the "not" operator to reverse boolean values.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: 'is_tired = True\n# Use "not" to get the opposite value\n',
      solution: 'is_tired = True\nprint(not is_tired)',
      hint: 'The "not" operator flips True to False and False to True'
    },
    {
      id: 'bool-5',
      title: 'All Boolean Operations',
      description: 'Practice and, or, not operators together.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: 'a = True\nb = False\n# Print results of: a and b, a or b, not a, not b\n',
      solution: 'a = True\nb = False\nprint(a and b)\nprint(a or b)\nprint(not a)\nprint(not b)',
      hint: 'Try all three boolean operators with your variables'
    },
    {
      id: 'bool-6',
      title: 'Simple If Statement',
      description: 'Use an if statement to make a decision.',
      difficulty: 'Beginner',
      xpReward: 15,
      startingCode: 'age = 16\n# If age is greater than 13, print "You are a teenager"\n',
      solution: 'age = 16\nif age > 13:\n    print("You are a teenager")',
      hint: 'Use if followed by a condition and a colon, then indent the next line'
    },
    {
      id: 'bool-7',
      title: 'If Statement with String',
      description: 'Use if statement with string comparison.',
      difficulty: 'Beginner',
      xpReward: 15,
      startingCode: 'weather = "sunny"\n# If weather is "sunny", print "Great day for a picnic!"\n',
      solution: 'weather = "sunny"\nif weather == "sunny":\n    print("Great day for a picnic!")',
      hint: 'Use == to compare strings (remember the quotes)'
    },
    {
      id: 'bool-8',
      title: 'If-Else Statement',
      description: 'Use if-else to handle two different cases.',
      difficulty: 'Intermediate',
      xpReward: 18,
      startingCode: 'score = 85\n# If score >= 80, print "Great job!", else print "Keep trying!"\n',
      solution: 'score = 85\nif score >= 80:\n    print("Great job!")\nelse:\n    print("Keep trying!")',
      hint: 'Use else after the if block to handle the alternative case'
    },
    {
      id: 'bool-9',
      title: 'If-Elif Statement',
      description: 'Use elif for multiple conditions.',
      difficulty: 'Intermediate',
      xpReward: 18,
      startingCode: 'temperature = 75\n# Hot: >80, Warm: 70-80, Cool: 60-70, Cold: <60\n',
      solution: 'temperature = 75\nif temperature > 80:\n    print("Hot")\nelif temperature >= 70:\n    print("Warm")\nelif temperature >= 60:\n    print("Cool")\nelse:\n    print("Cold")',
      hint: 'Use elif for additional conditions between if and else'
    },
    {
      id: 'bool-10',
      title: 'Grade Calculator',
      description: 'Create a grade calculator using if-elif-else.',
      difficulty: 'Intermediate',
      xpReward: 20,
      startingCode: 'grade = 87\n# A: 90+, B: 80-89, C: 70-79, D: 60-69, F: <60\n',
      solution: 'grade = 87\nif grade >= 90:\n    print("A")\nelif grade >= 80:\n    print("B")\nelif grade >= 70:\n    print("C")\nelif grade >= 60:\n    print("D")\nelse:\n    print("F")',
      hint: 'Use elif for each grade range, checking from highest to lowest'
    },
    {
      id: 'bool-11',
      title: 'Multiple Conditions with AND',
      description: 'Use "and" in if statements for multiple conditions.',
      difficulty: 'Intermediate',
      xpReward: 18,
      startingCode: 'age = 16\nhas_license = True\n# If age >= 16 AND has_license is True, print "Can drive"\n',
      solution: 'age = 16\nhas_license = True\nif age >= 16 and has_license:\n    print("Can drive")',
      hint: 'Use "and" to combine multiple conditions in an if statement'
    },
    {
      id: 'bool-12',
      title: 'Multiple Conditions with OR',
      description: 'Use "or" in if statements for alternative conditions.',
      difficulty: 'Intermediate',
      xpReward: 18,
      startingCode: 'day = "Saturday"\n# If day is "Saturday" OR "Sunday", print "Weekend!"\n',
      solution: 'day = "Saturday"\nif day == "Saturday" or day == "Sunday":\n    print("Weekend!")',
      hint: 'Use "or" when you want to check if either condition is true'
    },
    {
      id: 'bool-13',
      title: 'Nested If Statements',
      description: 'Put if statements inside other if statements.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: 'age = 18\nis_student = True\n# If age >= 18, check if student for discount eligibility\n',
      solution: 'age = 18\nis_student = True\nif age >= 18:\n    if is_student:\n        print("Adult student discount available")\n    else:\n        print("Adult pricing")\nelse:\n    print("Youth pricing")',
      hint: 'Indent the inner if statement further than the outer one'
    },
    {
      id: 'bool-14',
      title: 'Complex Boolean Logic',
      description: 'Combine multiple boolean operators in complex expressions.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: 'is_weekend = True\nis_sunny = False\nhas_homework = True\n# Check if it\'s a good day to go out\n',
      solution: 'is_weekend = True\nis_sunny = False\nhas_homework = True\nif (is_weekend and is_sunny) and not has_homework:\n    print("Perfect day to go out!")\nelse:\n    print("Maybe stay in today")',
      hint: 'Use parentheses to group conditions and "not" for negation'
    },
    {
      id: 'bool-15',
      title: 'User Input with Conditionals',
      description: 'Get user input and make decisions based on it.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: '# Ask user for their age, determine if they can vote\n',
      solution: 'age = int(input("Enter your age: "))\nif age >= 18:\n    print("You can vote!")\nelse:\n    print("You cannot vote yet")',
      hint: 'Remember to convert input to integer with int()'
    },
    {
      id: 'bool-16',
      title: 'String Conditionals',
      description: 'Make decisions based on string content.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: '# Ask user for favorite color, respond accordingly\n',
      solution: 'color = input("What\'s your favorite color? ").lower()\nif color == "blue":\n    print("Blue is calming!")\nelif color == "red":\n    print("Red is energetic!")\nelif color == "green":\n    print("Green is natural!")\nelse:\n    print("Great choice!")',
      hint: 'Use .lower() to handle different capitalizations'
    },
    {
      id: 'bool-17',
      title: 'Range Checking',
      description: 'Check if a number falls within a range.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: 'number = 45\n# Check if number is between 1 and 100 (inclusive)\n',
      solution: 'number = 45\nif 1 <= number <= 100:\n    print("Number is in range")\nelse:\n    print("Number is out of range")',
      hint: 'You can chain comparisons: 1 <= number <= 100'
    },
    {
      id: 'bool-18',
      title: 'Even or Odd Checker',
      description: 'Use modulo operator in conditionals to check even/odd.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: 'number = 17\n# Check if the number is even or odd using modulo\n',
      solution: 'number = 17\nif number % 2 == 0:\n    print("Even number")\nelse:\n    print("Odd number")',
      hint: 'A number is even if number % 2 equals 0'
    },
    {
      id: 'bool-19',
      title: 'Login System',
      description: 'Create a simple login system with username and password.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Create a simple login: correct username is "admin", password is "1234"\n',
      solution: 'username = input("Enter username: ")\npassword = input("Enter password: ")\n\nif username == "admin" and password == "1234":\n    print("Login successful!")\nelse:\n    print("Invalid credentials")',
      hint: 'Use "and" to check both username and password are correct'
    },
    {
      id: 'bool-20',
      title: 'Advanced Decision Tree',
      description: 'Create a complex decision-making system.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Movie recommendation system based on age and genre preference\n',
      solution: 'age = int(input("Enter your age: "))\ngenre = input("Preferred genre (action/comedy/drama): ").lower()\n\nif age < 13:\n    print("Recommended: Family movies")\nelif age < 18:\n    if genre == "action":\n        print("Recommended: Teen action movies")\n    elif genre == "comedy":\n        print("Recommended: Teen comedies")\n    else:\n        print("Recommended: Coming-of-age films")\nelse:\n    if genre == "action":\n        print("Recommended: Action blockbusters")\n    elif genre == "comedy":\n        print("Recommended: Adult comedies")\n    elif genre == "drama":\n        print("Recommended: Award-winning dramas")\n    else:\n        print("Recommended: Popular movies")',
      hint: 'Use nested if statements to create a decision tree'
    }
  ],
  'loops-lists': [
    {
      id: 'loop-1',
      title: 'First For Loop',
      description: 'Use a for loop to print numbers from 0 to 4.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Use a for loop to print numbers 0 to 4\n',
      solution: 'for i in range(5):\n    print(i)',
      hint: 'Use range(5) and don\'t forget the colon and indentation'
    },
    {
      id: 'loop-2',
      title: 'Custom Range',
      description: 'Print numbers from 1 to 10 using range with start parameter.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Use for loop to print numbers 1 to 10\n',
      solution: 'for i in range(1, 11):\n    print(i)',
      hint: 'Use range(1, 11) - the end number is not included'
    },
    {
      id: 'loop-3',
      title: 'Range with Step',
      description: 'Print even numbers from 2 to 20 using range with step.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Print even numbers from 2 to 20\n',
      solution: 'for i in range(2, 21, 2):\n    print(i)',
      hint: 'Use range(2, 21, 2) - the third parameter is the step size'
    },
    {
      id: 'loop-4',
      title: 'Loop with Message',
      description: 'Print "Python is fun!" 5 times using a loop.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: '# Print "Python is fun!" 5 times\n',
      solution: 'for i in range(5):\n    print("Python is fun!")',
      hint: 'Use range(5) and print the message inside the loop'
    },
    {
      id: 'loop-5',
      title: 'Creating Your First List',
      description: 'Create a list of your favorite fruits and print it.',
      difficulty: 'Beginner',
      xpReward: 10,
      startingCode: '# Create a list called fruits with 4 favorite fruits\n# Print the entire list\n',
      solution: 'fruits = ["apple", "banana", "orange", "grape"]\nprint(fruits)',
      hint: 'Use square brackets [] and separate items with commas'
    },
    {
      id: 'loop-6',
      title: 'Accessing List Items',
      description: 'Access individual items in a list using index.',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: 'colors = ["red", "green", "blue", "yellow"]\n# Print the first and third colors\n',
      solution: 'colors = ["red", "green", "blue", "yellow"]\nprint(colors[0])\nprint(colors[2])',
      hint: 'List indexing starts at 0, so first item is [0], third is [2]'
    },
    {
      id: 'loop-7',
      title: 'List Length',
      description: 'Find and print the length of a list using len().',
      difficulty: 'Beginner',
      xpReward: 12,
      startingCode: 'animals = ["cat", "dog", "bird", "fish", "hamster"]\n# Print how many animals are in the list\n',
      solution: 'animals = ["cat", "dog", "bird", "fish", "hamster"]\nprint(len(animals))',
      hint: 'Use len(list_name) to get the number of items in a list'
    },
    {
      id: 'loop-8',
      title: 'Looping Through a List',
      description: 'Use a for loop to print each item in a list.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'sports = ["soccer", "basketball", "tennis", "swimming"]\n# Use a for loop to print each sport\n',
      solution: 'sports = ["soccer", "basketball", "tennis", "swimming"]\nfor sport in sports:\n    print(sport)',
      hint: 'Use "for item in list:" to loop through each element'
    },
    {
      id: 'loop-9',
      title: 'List with Numbers',
      description: 'Create a list of numbers and calculate their sum using a loop.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: 'numbers = [10, 20, 30, 40, 50]\n# Use a loop to calculate and print the sum\n',
      solution: 'numbers = [10, 20, 30, 40, 50]\ntotal = 0\nfor num in numbers:\n    total = total + num\nprint(total)',
      hint: 'Initialize a total variable to 0, then add each number to it'
    },
    {
      id: 'loop-10',
      title: 'While Loop Basics',
      description: 'Use a while loop to count from 1 to 5.',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Use a while loop to print numbers 1 to 5\ncount = 1\n',
      solution: 'count = 1\nwhile count <= 5:\n    print(count)\n    count = count + 1',
      hint: 'Check condition, execute code, then update the variable'
    },
    {
      id: 'loop-11',
      title: 'While Loop with User Input',
      description: 'Keep asking for input until user enters "quit".',
      difficulty: 'Intermediate',
      xpReward: 18,
      startingCode: '# Keep asking for input until user types "quit"\n',
      solution: 'user_input = ""\nwhile user_input != "quit":\n    user_input = input("Enter something (or \'quit\' to stop): ")\n    if user_input != "quit":\n        print("You entered:", user_input)',
      hint: 'Initialize the variable before the while loop'
    },
    {
      id: 'loop-12',
      title: 'Adding Items to a List',
      description: 'Create an empty list and add items using append().',
      difficulty: 'Intermediate',
      xpReward: 15,
      startingCode: '# Create empty list, add three names using append, print list\n',
      solution: 'names = []\nnames.append("Alice")\nnames.append("Bob")\nnames.append("Charlie")\nprint(names)',
      hint: 'Use list_name.append(item) to add items to a list'
    },
    {
      id: 'loop-13',
      title: 'List Comprehension Basics',
      description: 'Create a list of squares using list comprehension.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: '# Create a list of squares of numbers 1-5 using list comprehension\n',
      solution: 'squares = [x**2 for x in range(1, 6)]\nprint(squares)',
      hint: 'Use [expression for variable in range()] syntax'
    },
    {
      id: 'loop-14',
      title: 'Nested Loops',
      description: 'Use nested loops to create a multiplication table.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: '# Create a 3x3 multiplication table using nested loops\n',
      solution: 'for i in range(1, 4):\n    for j in range(1, 4):\n        print(i * j, end=" ")\n    print()',
      hint: 'Put one loop inside another, use end=" " to print on same line'
    },
    {
      id: 'loop-15',
      title: 'Loop with Conditions',
      description: 'Print only even numbers from a list.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\n# Print only the even numbers\n',
      solution: 'numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]\nfor num in numbers:\n    if num % 2 == 0:\n        print(num)',
      hint: 'Use if num % 2 == 0 to check if a number is even'
    },
    {
      id: 'loop-16',
      title: 'Break Statement',
      description: 'Use break to exit a loop early.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Print numbers 1-10, but stop when you reach 6\n',
      solution: 'for i in range(1, 11):\n    if i == 6:\n        break\n    print(i)',
      hint: 'Use break to exit the loop when a condition is met'
    },
    {
      id: 'loop-17',
      title: 'Continue Statement',
      description: 'Use continue to skip certain iterations.',
      difficulty: 'Advanced',
      xpReward: 18,
      startingCode: '# Print numbers 1-10, but skip number 5\n',
      solution: 'for i in range(1, 11):\n    if i == 5:\n        continue\n    print(i)',
      hint: 'Use continue to skip the rest of the current iteration'
    },
    {
      id: 'loop-18',
      title: 'Enumerate Function',
      description: 'Use enumerate to get both index and value in a loop.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: 'fruits = ["apple", "banana", "cherry"]\n# Print index and value for each fruit\n',
      solution: 'fruits = ["apple", "banana", "cherry"]\nfor index, fruit in enumerate(fruits):\n    print(f"{index}: {fruit}")',
      hint: 'Use enumerate(list) to get both index and value'
    },
    {
      id: 'loop-19',
      title: 'List Methods Practice',
      description: 'Use various list methods like insert, remove, pop.',
      difficulty: 'Advanced',
      xpReward: 20,
      startingCode: 'my_list = ["a", "b", "c"]\n# Insert "x" at index 1, remove "b", print final list\n',
      solution: 'my_list = ["a", "b", "c"]\nprint("Original:", my_list)\nmy_list.insert(1, "x")\nprint("After insert:", my_list)\nmy_list.remove("b")\nprint("After remove:", my_list)',
      hint: 'Use insert(index, item) and remove(item) methods'
    },
    {
      id: 'loop-20',
      title: 'Complex List Operations',
      description: 'Combine loops, lists, and conditionals in a practical example.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Create a grade book: store names and grades, calculate average\n',
      solution: 'students = ["Alice", "Bob", "Charlie", "Diana"]\ngrades = [85, 92, 78, 96]\n\nprint("Grade Report:")\nfor i in range(len(students)):\n    print(f"{students[i]}: {grades[i]}")\n\ntotal = 0\nfor grade in grades:\n    total += grade\naverage = total / len(grades)\nprint(f"Class average: {average:.1f}")',
      hint: 'Use parallel lists and range(len()) to access corresponding elements'
    }
  ],
  'functions': [
    {
      id: 'func-1',
      title: 'Your First Function',
      description: 'Create a function that prints "Hello, World!" and call it.',
      difficulty: 'Beginner',
      xpReward: 15,
      startingCode: '# Define a function called say_hello\n# Call the function\n',
      solution: 'def say_hello():\n    print("Hello, World!")\n\nsay_hello()',
      hint: 'Use def to create a function, don\'t forget the colon and indentation'
    },
    {
      id: 'func-2',
      title: 'Function with Print Statement',
      description: 'Create a function that prints your favorite quote.',
      difficulty: 'Beginner',
      xpReward: 15,
      startingCode: '# Create a function called favorite_quote that prints your favorite quote\n# Call the function\n',
      solution: 'def favorite_quote():\n    print("The only way to do great work is to love what you do.")\n\nfavorite_quote()',
      hint: 'Define the function with def, then call it by name'
    },
    {
      id: 'func-3',
      title: 'Function That Calls Another Function',
      description: 'Create two functions where one calls the other.',
      difficulty: 'Beginner',
      xpReward: 15,
      startingCode: '# Create function1 that prints "First function"\n# Create function2 that calls function1 and prints "Second function"\n',
      solution: 'def function1():\n    print("First function")\n\ndef function2():\n    function1()\n    print("Second function")\n\nfunction2()',
      hint: 'You can call one function from inside another function'
    },
    {
      id: 'func-4',
      title: 'Function with One Parameter',
      description: 'Create a function that takes a name and prints a greeting.',
      difficulty: 'Beginner',
      xpReward: 18,
      startingCode: '# Define a function that takes a name parameter\n# Call it with your name\n',
      solution: 'def greet(name):\n    print("Hello, " + name + "!")\n\ngreet("Alice")',
      hint: 'Put the parameter in parentheses and use it inside the function'
    },
    {
      id: 'func-5',
      title: 'Function with Two Parameters',
      description: 'Create a function that takes two numbers and prints their sum.',
      difficulty: 'Beginner',
      xpReward: 18,
      startingCode: '# Define a function that takes two numbers and prints their sum\n# Call it with two numbers\n',
      solution: 'def add_and_print(a, b):\n    print(a + b)\n\nadd_and_print(5, 3)',
      hint: 'Separate multiple parameters with commas'
    },
    {
      id: 'func-6',
      title: 'Function with String Parameter',
      description: 'Create a function that takes a color and prints a message about it.',
      difficulty: 'Beginner',
      xpReward: 18,
      startingCode: '# Create a function that takes a color and says "I like [color]"\n# Call it with your favorite color\n',
      solution: 'def like_color(color):\n    print("I like " + color)\n\nlike_color("blue")',
      hint: 'Use string concatenation to include the parameter in your message'
    },
    {
      id: 'func-7',
      title: 'Function with Return Value',
      description: 'Create a function that adds two numbers and returns the result.',
      difficulty: 'Intermediate',
      xpReward: 20,
      startingCode: '# Define a function that adds two numbers and returns the result\n# Call it and print the result\n',
      solution: 'def add_numbers(a, b):\n    return a + b\n\nresult = add_numbers(5, 3)\nprint(result)',
      hint: 'Use return to send back the result, then store it in a variable'
    },
    {
      id: 'func-8',
      title: 'Function Returning a String',
      description: 'Create a function that returns a formatted greeting.',
      difficulty: 'Intermediate',
      xpReward: 20,
      startingCode: '# Create a function that takes a name and returns "Hello, [name]!"\n# Call it and print the returned value\n',
      solution: 'def create_greeting(name):\n    return "Hello, " + name + "!"\n\ngreeting = create_greeting("Bob")\nprint(greeting)',
      hint: 'Return the string instead of printing it inside the function'
    },
    {
      id: 'func-9',
      title: 'Function with Multiple Parameters and Return',
      description: 'Create a function that calculates the area of a rectangle.',
      difficulty: 'Intermediate',
      xpReward: 22,
      startingCode: '# Define a function calculate_area that takes width and height\n# Return width * height\n# Call it and print the result\n',
      solution: 'def calculate_area(width, height):\n    return width * height\n\narea = calculate_area(5, 3)\nprint(area)',
      hint: 'Multiple parameters are separated by commas'
    },
    {
      id: 'func-10',
      title: 'Function with Default Parameter',
      description: 'Create a function with a default parameter value.',
      difficulty: 'Intermediate',
      xpReward: 22,
      startingCode: '# Create a function greet_person with name parameter and default greeting "Hi"\n# Call it with and without the greeting parameter\n',
      solution: 'def greet_person(name, greeting="Hi"):\n    print(greeting + ", " + name + "!")\n\ngreet_person("Alice")\ngreet_person("Bob", "Hello")',
      hint: 'Set default values using parameter=default_value'
    },
    {
      id: 'func-11',
      title: 'Function That Modifies a List',
      description: 'Create a function that takes a list and adds an item to it.',
      difficulty: 'Intermediate',
      xpReward: 22,
      startingCode: '# Create a function that adds an item to a list\n# Test it with a list of fruits\n',
      solution: 'def add_to_list(my_list, item):\n    my_list.append(item)\n    return my_list\n\nfruits = ["apple", "banana"]\nprint("Before:", fruits)\nadd_to_list(fruits, "orange")\nprint("After:", fruits)',
      hint: 'Use the append() method to add items to lists'
    },
    {
      id: 'func-12',
      title: 'Function with Local Variables',
      description: 'Understand local variables inside functions.',
      difficulty: 'Intermediate',
      xpReward: 20,
      startingCode: '# Create a function that uses local variables\n# Show that local variables don\'t affect global ones\n',
      solution: 'x = 10\n\ndef test_local():\n    x = 20\n    print("Inside function:", x)\n\nprint("Before function:", x)\ntest_local()\nprint("After function:", x)',
      hint: 'Variables created inside functions are local to that function'
    },
    {
      id: 'func-13',
      title: 'Function That Returns Multiple Values',
      description: 'Create a function that returns multiple values using tuple.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Create a function that returns both quotient and remainder of division\n# Call it and unpack the results\n',
      solution: 'def divide_and_remainder(a, b):\n    quotient = a // b\n    remainder = a % b\n    return quotient, remainder\n\nq, r = divide_and_remainder(17, 5)\nprint("Quotient:", q)\nprint("Remainder:", r)',
      hint: 'Return multiple values separated by commas, unpack with multiple variables'
    },
    {
      id: 'func-14',
      title: 'Function with Variable Arguments',
      description: 'Create a function that accepts any number of arguments.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Create a function that calculates the sum of any number of arguments\n# Use *args to accept variable arguments\n',
      solution: 'def sum_all(*args):\n    total = 0\n    for num in args:\n        total += num\n    return total\n\nresult1 = sum_all(1, 2, 3)\nresult2 = sum_all(10, 20, 30, 40)\nprint(result1)\nprint(result2)',
      hint: 'Use *args to accept any number of positional arguments'
    },
    {
      id: 'func-15',
      title: 'Recursive Function',
      description: 'Create a function that calls itself (recursion).',
      difficulty: 'Advanced',
      xpReward: 28,
      startingCode: '# Create a recursive function to calculate factorial\n# factorial(5) = 5 * 4 * 3 * 2 * 1\n',
      solution: 'def factorial(n):\n    if n <= 1:\n        return 1\n    else:\n        return n * factorial(n - 1)\n\nresult = factorial(5)\nprint(result)',
      hint: 'Base case stops recursion, recursive case calls the function with modified input'
    },
    {
      id: 'func-16',
      title: 'Function as Parameter',
      description: 'Pass one function as a parameter to another function.',
      difficulty: 'Advanced',
      xpReward: 28,
      startingCode: '# Create functions for add and multiply\n# Create apply_operation that takes a function and two numbers\n',
      solution: 'def add(a, b):\n    return a + b\n\ndef multiply(a, b):\n    return a * b\n\ndef apply_operation(func, x, y):\n    return func(x, y)\n\nresult1 = apply_operation(add, 5, 3)\nresult2 = apply_operation(multiply, 5, 3)\nprint(result1)\nprint(result2)',
      hint: 'Functions are objects in Python and can be passed as arguments'
    },
    {
      id: 'func-17',
      title: 'Lambda Function',
      description: 'Create and use lambda (anonymous) functions.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Create lambda functions for square and cube operations\n# Use them to calculate values\n',
      solution: 'square = lambda x: x ** 2\ncube = lambda x: x ** 3\n\nprint(square(5))\nprint(cube(3))',
      hint: 'Lambda syntax: lambda parameters: expression'
    },
    {
      id: 'func-18',
      title: 'Function Documentation',
      description: 'Add docstrings to document your functions.',
      difficulty: 'Advanced',
      xpReward: 22,
      startingCode: '# Create a function with proper docstring documentation\n# Include description, parameters, and return value info\n',
      solution: 'def calculate_bmi(weight, height):\n    """\n    Calculate Body Mass Index (BMI)\n    \n    Args:\n        weight (float): Weight in kilograms\n        height (float): Height in meters\n    \n    Returns:\n        float: BMI value\n    """\n    return weight / (height ** 2)\n\nbmi = calculate_bmi(70, 1.75)\nprint(f"BMI: {bmi:.1f}")',
      hint: 'Use triple quotes for docstrings right after the def line'
    },
    {
      id: 'func-19',
      title: 'Function Error Handling',
      description: 'Add basic error handling to functions.',
      difficulty: 'Advanced',
      xpReward: 25,
      startingCode: '# Create a division function that handles division by zero\n# Return an error message for invalid operations\n',
      solution: 'def safe_divide(a, b):\n    if b == 0:\n        return "Error: Cannot divide by zero"\n    else:\n        return a / b\n\nprint(safe_divide(10, 2))\nprint(safe_divide(10, 0))',
      hint: 'Check for problematic conditions before performing operations'
    },
    {
      id: 'func-20',
      title: 'Complete Function System',
      description: 'Create a mini calculator with multiple functions working together.',
      difficulty: 'Advanced',
      xpReward: 30,
      startingCode: '# Create a calculator with add, subtract, multiply, divide functions\n# Create a main function that uses all of them\n',
      solution: 'def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b\n\ndef multiply(a, b):\n    return a * b\n\ndef divide(a, b):\n    if b != 0:\n        return a / b\n    else:\n        return "Error: Division by zero"\n\ndef calculator(operation, x, y):\n    if operation == "add":\n        return add(x, y)\n    elif operation == "subtract":\n        return subtract(x, y)\n    elif operation == "multiply":\n        return multiply(x, y)\n    elif operation == "divide":\n        return divide(x, y)\n    else:\n        return "Unknown operation"\n\nprint(calculator("add", 10, 5))\nprint(calculator("multiply", 4, 7))\nprint(calculator("divide", 15, 3))',
      hint: 'Create separate functions for each operation, then a main function to coordinate them'
    }
  ]
};

export function TopicExercises({ topic, completedExercises, onStartExercise }: TopicExercisesProps) {
  const exercises = exerciseData[topic] || [];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'bg-green-100 text-green-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <h2>{topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Exercises</h2>
        <Badge variant="secondary">
          {completedExercises.filter(id => exercises.some(ex => ex.id === id)).length}/{exercises.length} completed
        </Badge>
      </div>

      <div className="grid gap-4">
        {exercises.map((exercise) => {
          const isCompleted = completedExercises.includes(exercise.id);
          
          return (
            <Card key={exercise.id} className={`transition-all hover:shadow-md ${isCompleted ? 'border-green-200 bg-green-50' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="flex items-center gap-2">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                      {exercise.title}
                    </CardTitle>
                    <CardDescription>{exercise.description}</CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getDifficultyColor(exercise.difficulty)}>
                      {exercise.difficulty}
                    </Badge>
                    <div className="flex items-center gap-1 text-sm text-orange-600">
                      <Star className="w-4 h-4" />
                      {exercise.xpReward} XP
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <Button 
                  onClick={() => onStartExercise(exercise)}
                  variant={isCompleted ? "outline" : "default"}
                  className="w-full"
                >
                  {isCompleted ? 'Practice Again' : 'Start Exercise'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}