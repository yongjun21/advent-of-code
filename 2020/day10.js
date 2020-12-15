function getDistribution (input) {
  const sorted = [0, ...input].sort((a, b) => a - b)
  sorted.push(sorted[sorted.length - 1] + 3)
  const dist = new Map()
  for (let i = 1; i < sorted.length; i++) {
    const diff = sorted[i] - sorted[i - 1]
    dist.set(diff, (dist.get(diff) || 0) + 1)
  }
  return dist
}

function countArrangements (input) {
  const sorted = [0, ...input].sort((a, b) => a - b)
  const arrangements = [1]
  for (let i = 1; i < sorted.length; i++) {
    arrangements[i] = 0
    for (let j = i - 1; j >= 0; j--) {
      if (sorted[i] - sorted[j] > 3) break
      arrangements[i] += arrangements[j]
    }
  }
  return arrangements[arrangements.length - 1]
}

const test = `
160
34
123
159
148
93
165
56
179
103
171
44
110
170
147
98
25
37
137
71
5
6
121
28
19
134
18
7
66
90
88
181
89
41
156
46
8
61
124
9
161
72
13
172
111
59
105
51
109
27
152
117
52
68
95
164
116
75
78
180
81
47
104
12
133
175
16
149
135
99
112
38
67
53
153
2
136
113
17
145
106
31
45
169
146
168
26
36
118
62
65
142
130
1
140
84
94
141
122
22
48
102
60
178
127
73
74
87
182
35
`.trim().split('\n').map(Number)

const dist = getDistribution(test)
console.log(dist.get(1) * dist.get(3))
console.log(countArrangements(test))
