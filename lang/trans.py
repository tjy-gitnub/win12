from msvcrt import getch
from colorama import init
init(autoreset=True)
black=30
red=31
green=32
yellow=33
blue=34
pink=35
cyan=36
white=37
fullchar='█'
def color(what,text=None,bg=None,bold=False,underline=False,blink=False,fanxian=False,disnone=False):
    clist=[]
    clist.append(str(text)) if text else None
    clist.append(str(bg+10)) if bg else None
    clist.append('1') if bold else None
    clist.append('4') if underline else None
    clist.append('5') if blink else None
    clist.append('7') if fanxian else None
    clist.append('8') if disnone else None
    return '\033['+';'.join(clist)+'m'+what+'\033[0m'

def clear():
    print("\x1b[2J\x1b[H",end='')

clear_c="\x1b[2J\x1b[H"
clear_line_c="\r\033[K"



f=open('../desktop.html','r',encoding='utf8').read().split('\n')
p=open('./lang_en.properties','a',encoding='utf8')
n=open('../desktop.html','w',encoding='utf8')
i=int(input('line> '))
while i<len(f):
    i+=1
    clear()
    print(f[i-7])
    print(f[i-6])
    print(f[i-5])
    print(f[i-4])
    print(f[i-3])
    print(f[i-2])
    print(f[i-1])
    print(color(f[i],blue))
    if i<len(f)-1:
        print(f[i+1])
    if i<len(f)-2:
        print(f[i+2])
    if i<len(f)-3:
        print(f[i+3])
    if i<len(f)-4:
        print(f[i+4])
    if i<len(f)-5:
        print(f[i+5])
    print('------------------------------------\n')
    pos=len(f[i])
    while 1:
        print(clear_line_c+str(i)+'   '+f[i][:pos]+'|'+f[i][pos:],end='')
        g=getch()
        if g==b'\r':
            # 回车键
            break
        elif g==b'\xe0':
            g=getch()
            # 上下左右按键
            if g==b'K':
                pos-=1
            elif g==b'M':
                pos+=1
            elif g==b'H':
                i-=2
                break
            elif g==b'P':
                break
        elif g==b' ' or g==b'/':
            # 空格或“/”建
            print('')
            iid=input('> ')
            if not '=' in iid:
                f[i]=f[i][:pos]+' data-i18n="'+iid+'"'+f[i][pos:]
                break
            txt='='.join(iid.split('=')[1:])
            iid=iid.split('=')[0]
            f[i]=f[i][:pos]+' data-i18n="'+iid+'"'+f[i][pos:]
            p.write(iid+'='+txt+'\n')
            break
        elif g==b'\x1b':
            # ESC键，保存内容并退出
            n.write('\n'.join(f))
            exit()