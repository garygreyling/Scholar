// ==========================================================================
// Project:   Scholar.Course Fixtures
// Copyright: ©2009 My Company, Inc.
// ==========================================================================
/*globals Scholar */

sc_require('models/course');

Scholar.Course.FIXTURES = [

  // TODO: Add your data fixtures here.
  // All fixture records must have a unique primary key (default 'guid').  See 
  // the example below.

  { guid: 1,
    name: "HR",
    code: "hr001",
    unit_standards: [1, 2] },
  
  { guid: 2,
    name: "Typing",
    code: "tp001",
    unit_standards: [2, 3] },
  
  { guid: 3,
    name: "Writing",
    code: "wr001",
    unit_standards: [3, 4] },
  
  { guid: 4,
    name: "Numeracy",
    code: "nu001",
    unit_standards: [4, 5] },
  
  { guid: 5,
    name: "EUC",
    code: "eu001",
    unit_standards: [1, 5] }

];
