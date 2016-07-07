// Used to populate the select tag for counties
var NUMCOMP = 0;
var COUNTIES = ["Cass",
                "Burleigh",
                "Grand Forks",
                "Ward",
                "Williams",
                "Stark",
                "Morton",
                "Stutsman",
                "Richland",
                "Rolette",
                "Ramsey",
                "Barnes",
                "McKenzie",
                "Walsh",
                "Mountrail",
                "McLean",
                "Mercer",
                "Traill",
                "Pembina",
                "Benson",
                "Bottineau",
                "McHenry",
                "Ransom",
                "Dickey",
                "Sioux",
                "Pierce",
                "Dunn",
                "Wells",
                "LaMoure",
                "Sargent",
                "Cavalier",
                "Emmons",
                "Foster",
                "Bowman",
                "Nelson",
                "McIntosh",
                "Hettinger",
                "Renville",
                "Divide",
                "Kidder",
                "Adams",
                "Eddy",
                "Grant",
                "Griggs",
                "Towner",
                "Burke",
                "Steele",
                "Logan",
                "Oliver",
                "Golden Valley",
                "Sheridan",
                "Billings",
                "Slope"
                ];
/* Used for coloring the map according to species | UPDATE 6/24/16 COLORS ALWAYS RED YELLOW AND GREEN, THE MIN IS 0 MAX IS 500, STEP IS 500/3
/*var LAYER_STYLES = {
'tmale': {
  'min': 0,
  'max': 500,
  'colors': [
    '#fce5cd',
    '#f9cb9c',
    '#f6b26b',
    '#e69138',
    '#b45f06'
  ]
},
'Anopheles': {
  'min': 0,
  'max': 500,
  'colors': [
'#5D87A0',
'#406C86',
'#28536C',
'#163C52',
'#092739'
  ]
},
'Aedes': {
  'min': 0,
  'max': 500,
  'colors': [
    '#CCFF99',
    '#B2FF66',
    '#99FF33',
    '#80FF00',
    '#66CC00'
  ]
},
'Aedes_vexans': {
  'min': 0,
  'max': 500,
  'colors': [
    '#FFCEAA',
    '#D4976A',
    '#AA6939',
    '#804215',
    '#552400'
  ]
},
'Culex': {
  'min': 0,
  'max': 500,
  'colors': [
    '#6875AB',
    '#49578F',
    '#303D74',
    '#1C2858',
    '#0D163C'
  ]
},
'Culex_Tarsalis': {
  'min': 0,
  'max': 500,
  'colors': [
    '#f4cccc',
    '#ea9999',
    '#e06666',
    '#cc0000',
    '#990000'
  ]
},
'Culex_salinarius': {
  'min': 0,
  'max': 500,
  'colors': [
    '#5BA391',
    '#3D8976',
    '#256F5C',
    '#135444',
    '#063A2D'
  ]
},
'Culiseta': {
  'min': 0,
  'max': 500,
  'colors': [
    '#d9ead3',
    '#b6d7a8',
    '#93c47d',
    '#6aa84f',
    '#38761d'
  ]
},
'Other': {
  'min': 0,
  'max': 500,
  'colors': [
    '#8963A9',
    '#6C458E',
    '#522B72',
    '#3A1857',
    '#250A3C'
  ]
},
'tfemale': {
  'min': 0,
  'max': 500,
  'colors': [
    '#cfe2f3',
    '#9fc5e8',
    '#6fa8dc',
    '#3d85c6',
    '#0b5394'
  ]
},
'Total_Mosquitoes': {
  'min': 0,
  'max': 500,
  'colors': [
    '#D2EE85',
    '#AAC759',
    '#84A136',
    '#617B1B',
    '#405409'
  ]
}
}*/
//wE DONT USE THE ABOVE CODE IN MY VERSION OF THE WEBSITE, SINCE WE DONT STYLE EACH LAYER DIFFERENTLY BY SPECIES, INSTEAD EACH LAYER I STYLED IN THE SAME WAY TO INCREASE READABILITY.*/
var COLORS = [ //COLOR GRADIENT FROM GREEN TO RED || Update 6.27.16 WE ARE USING 'testCol' IN THE CODE BECAUSE IT GIVE A MORE DEFINED READING ABOUT LOW/MEDIUM/HIGH RISK
    '#00FFFF', //#00ff00
    '#660066', //#0DF200
    '#1AE600',
    '#26D900',
    '#33CC00',
    '#40BF00',
    '#4CB200',
    '#59A600',
    '#669900',
    '#738C00',
    '#808000',
    '#8C7300',
    '#996600',
    '#A65900',
    '#B24D00',
    '#BF4000',
    '#CC3300',
    '#D92600',
    '#E61900',
    '#F20D00',
    '#FF0000']
var testCol = 
[
'#00FF00',
'#FFFF00',
'#FF0000'
]

var SPECIES = [
    'Total_Mosquitoes',
    'tfemale',
    'tmale',
    'Anopheles',
    'Aedes',
    'Aedes_vexans',
    'Culex',
    'Culex_Tarsalis',
    'Culex_salinarius',
    'Culiseta',
    'Other' ]

