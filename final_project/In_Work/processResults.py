# -*- coding: utf-8 -*-
"""
Created on Thu May 21 13:02:26 2015

@author: jasonshu
"""

import pandas as pd
import numpy as np

import csv


results = pd.read_csv('/Users/jasonshu/Dropbox/1) Data Viz/Project/Data/survey_results.csv')
budgets = pd.read_csv('/Users/jasonshu/Dropbox/1) Data Viz/Project/Data/natoSpendingPct.csv')

countries = results.columns.tolist()

countries.pop(0)


master = []

for country in countries:
    tempDict = {'name': country, 'region': 'earth', 'income': [], 'lifeExpectancy': []}
    
    for row in range(len(budgets.ix[44:,0])):
        year = int(budgets.ix[row,'date'])
        budget = float(budgets.ix[row,country])
        tempDict['income'].append([year,budget])
    
    for row in range(len(results.ix[:,0])):
        year = int(results.ix[row,:]['Year'])
        result = float(results.ix[row,country])
        tempDict['lifeExpectancy'].append([year,result])
    master.append(tempDict)
    