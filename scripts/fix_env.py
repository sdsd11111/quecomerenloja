with open('/root/que-comer-en-loja/.env.local', 'r') as f:
    lines = f.readlines()

new_lines = []
for line in lines:
    if line.startswith('GASTRONOMIA_DB_URL='):
        new_lines.append('GASTRONOMIA_DB_URL="mysql://agenda_user:AgendaCultural2026%21@172.17.0.1:3306/loja_gastronomia"\n')
    else:
        new_lines.append(line)

with open('/root/que-comer-en-loja/.env.local', 'w') as f:
    f.writelines(new_lines)
print("SUCCESS_UPDATE_ENV")
