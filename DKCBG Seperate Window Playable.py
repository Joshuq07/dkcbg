# Joshua Patrick 1/8/2025 - DKCBG Seperate Window Playable
from PyQt5.QtWidgets import QApplication, QMainWindow, QVBoxLayout, QHBoxLayout, QWidget, QTextEdit, QLineEdit, QPushButton, QLabel, QGridLayout
from PyQt5.QtCore import pyqtSignal, QObject, Qt
from PyQt5.QtGui import QPixmap, QImage
import threading
import queue
import sys
import random
import operator
from PIL import Image

class ConsoleStream(QObject):
    outputWritten = pyqtSignal(str)

    def write(self, text):
        self.outputWritten.emit(text)

    def flush(self):
        pass


class MainWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle("Donkey Kong Country Board Game Helper")
        self.setGeometry(100, 100, 800, 600)

        # Set up the main layout
        main_layout = QHBoxLayout()

        # Left side layout
        left_layout = QVBoxLayout()

        self.output_area = QTextEdit(self)
        self.output_area.setReadOnly(True)
        self.output_area.setStyleSheet("font-size: 12pt;")
        left_layout.addWidget(self.output_area)

        self.input_area = QLineEdit(self)
        self.input_area.returnPressed.connect(self.handle_input)
        left_layout.addWidget(self.input_area)

        self.submit_button = QPushButton("Submit", self)
        self.submit_button.clicked.connect(self.handle_input)
        left_layout.addWidget(self.submit_button)

        # Right side layout
        right_layout = QVBoxLayout()

        # Add main image display above the grid
        self.main_image_label = QLabel(self)
        self.main_image_label.setFixedSize(1345, int(952.5))  # Set the size of the main image display
        self.main_image_label.setStyleSheet("background-color: lightgray; border: 1px solid black;")
        self.main_image_label.setAlignment(Qt.AlignCenter)
        right_layout.addWidget(self.main_image_label)

        # Create the grid layout for card slots
        self.grid_layout = QGridLayout()
        self.grid_layout.setSpacing(5)

        self.rectangles = {}
        for row in range(5):
            for col in range(10):
                label = QLabel(self)
                label.setFixedSize(67, 97)
                label.setStyleSheet("background-color: white;")
                label.setAlignment(Qt.AlignCenter)
                self.rectangles[(row, col)] = label
                self.grid_layout.addWidget(label, row, col)

        right_layout.addLayout(self.grid_layout)

        # Combine layouts
        central_widget = QWidget()
        main_layout.addLayout(left_layout)
        main_layout.addLayout(right_layout)
        central_widget.setLayout(main_layout)
        self.setCentralWidget(central_widget)

        # Redirect stdout
        self.console_stream = ConsoleStream()
        self.console_stream.outputWritten.connect(self.update_output)
        sys.stdout = self.console_stream

        self.input_queue = queue.Queue()

        self.program_thread = threading.Thread(target=self.run_program)
        self.program_thread.daemon = True
        self.program_thread.start()

        self.input_area.setFocus()
        self.showMaximized()

    def update_output(self, text):
        cursor = self.output_area.textCursor()
        cursor.movePosition(cursor.End)
        cursor.insertText(text)
        self.output_area.ensureCursorVisible()

    def handle_input(self):
        user_input = self.input_area.text()
        self.input_area.clear()
        print(f"Input: {user_input}")
        self.input_queue.put(user_input)

    def run_program(self):
        def input_override(prompt=""):
            print(prompt, end="")
            return self.input_queue.get()

        global input
        input = input_override
        main(self)  # Replace with your program logic

    def change_main_image(self, image_input):
        """
        Change the image displayed in the main image label.
        Accepts either a file path (str) or a PIL.Image object.
        """
        if isinstance(image_input, str):
            # If input is a file path
            image = QImage(image_input)
        elif isinstance(image_input, Image.Image):
            # If input is a PIL.Image object, convert it to a QImage
            image_data = image_input.tobytes("raw", "RGBA")
            image = QImage(image_data, image_input.width, image_input.height, QImage.Format_RGBA8888)
        else:
            print("Error: Invalid image input. Must be a file path or PIL.Image object.")
            return
    
        if not image.isNull():
            scaled_image = image.scaled(self.main_image_label.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation)
            self.main_image_label.setPixmap(QPixmap.fromImage(scaled_image))
        else:
            print("Warning: Could not load the image.")


    def change_rectangle_image(self, row, col, image_path):
        """
        Change the image of a rectangle at (row, col) to the specified image dynamically.
        """
        label = self.rectangles.get((row, col))
        if label:
            image = QImage(image_path)
            if not image.isNull():
                scaled_image = image.scaled(label.size(), Qt.KeepAspectRatio, Qt.SmoothTransformation)
                label.setPixmap(QPixmap.fromImage(scaled_image))
            else:
                print(f"Warning: Could not load image at {image_path}")


    






def level_check(inventory, level_list, bonus_coin_count, money):
    options = []
    possible_levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
                       71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142]
    for levels in level_list:
        opt = 0
        for opts in possible_levels:
            if opts == levels:
                possible_levels.pop(opt)
            opt += 1
    
    for levels in possible_levels:
        materials = material_list[levels-1]
        m_test = True
        money_test = False
        for req in materials:
            if req in inventory:
                pass
            else:
                m_test = False
                break
        if levels in money_brackets[0]:
            if money > 50:
                money_test = True
        elif levels in money_brackets[1]:
            if money > 100:
                money_test = True
        elif levels in money_brackets[2]:
            if money > 150:
                money_test = True
        elif levels in money_brackets[3]:
            if money > 200:
                money_test = True
        elif levels in money_brackets[4]:
            if money > 250:
                money_test = True
        elif levels in money_brackets[5]:
            if money > 300:
                money_test = True
        elif levels in money_brackets[6]:
            if money > 350:
                money_test = True
        if m_test == True:
            if (money_test == True):
                if levels == 39 or levels == 136:
                    count = operator.countOf(inventory,'Boss')
                    if (count > 1):
                        options.append(levels)
                elif (levels == 82) or (levels == 83) or (levels == 84) or (levels == 85) or (levels == 86) or (levels == 87) or (levels == 137) or (levels == 138) or (levels == 139) or (levels == 140) or (levels == 141) or (levels == 142):
                    if (bonus_coin_count > 1):
                        options.append(levels)
                else:
                    options.append(levels)
    return options    

def determine_space(current_space, roll, built_levels, krool_counter, banana_birds_remaining, picture):
    rem = roll
    roll_count = 1
    cur_space = current_space
    pass_start = False
    while rem != 0:
        if (cur_space == 6):
            if (rem != 1):
                pass_start = True
            if (len(built_levels) == 142) and (len(krool_counter) == 3) and (banana_birds_remaining == 0):
                rem_check = False
                d_check = False
                while (d_check == False):
                    win_question = input("Do you want to go to the start space (Yes or No)\n").lower()
                    print("")
                    if (win_question == "yes"):
                        cur_space = 5
                        d_check = True
                        rem_check = True
                        break
                    else:
                        ans2 = input("Are you sure (Yes or no)").lower()
                        if ans2 == "yes":
                            d_check = True
                        else:
                            d_check = False
                if (rem_check == True):
                    break
            else:
                cur_space = 7
        elif (cur_space == 12):
            ans = False
            if (rem > 11):
                new_rem = rem - 11
                split_1 = new_rem - 1 + 41
            else:
                split_1 = rem-1+13
            if (rem > 17):
                new_rem = rem - 17
                split_2 = new_rem - 1 + 140
            else:
                split_2 = rem-1+24
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA")
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_orig = space_coordinates[current_space + (roll-rem) - 1][0]
            y_cor_orig = space_coordinates[current_space + (roll-rem) - 1][1]
            piece_position = (x_cor_1, y_cor_1)
            combined_image = board_image.copy()
            combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            while (ans == False):
                split = input("Would you like to continue through Kongo Jungle or move to Monkey Mines, 1 for KJ, 2 for MM").lower()
                if (split == "1"):
                    cur_space = 13
                    ans = True
                elif (split == "2"):
                    cur_space = 24
                    ans = True
                    
                else:
                    ans = False
            print("")
        elif (cur_space == 9):
            ans = False
            m_test = False
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA") 
            if (rem > 3):
                m_test = True
                if (rem > 14):
                    new_rem = rem - 14
                    split_1 = new_rem - 1 + 41
                else:
                    new_rem = rem - 3
                    split_1 = new_rem - 1 + 13
                
                new_rem = rem - 3
                split_4 = new_rem - 1 + 24
                x_cor_4 = space_coordinates[split_4 - 1][0]
                y_cor_4 = space_coordinates[split_4 - 1][1]
                piece_position = (x_cor_4, y_cor_4)
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                #KJ 10-12
                split_1 = rem-1+10
            if (rem > 17):
                new_rem = rem - 17
                split_2 = new_rem - 1 + 288
            else:
                split_2 = rem - 1 + 254
            
            if (rem > 4):
                if (rem > 7):
                    new_rem = rem-7
                    split_5 = new_rem - 1 + 274
                    x_cor_5 = space_coordinates[split_5 - 1][0]
                    y_cor_5 = space_coordinates[split_5 - 1][1]
                    piece_position = (x_cor_5, y_cor_5)
                    if (m_test == True):
                        combined_image = combined_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                else:
                    new_rem = rem-4
                    split_5 = new_rem - 1 + 271
                    x_cor_5 = space_coordinates[split_5 - 1][0]
                    y_cor_5 = space_coordinates[split_5 - 1][1]
                    piece_position = (x_cor_5, y_cor_5)
                    if (m_test == True):
                        combined_image = combined_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                if (rem > 17):
                    new_rem = rem-17
                    split_3 = new_rem - 1 + 52
                else:
                    new_rem = rem - 4
                    split_3 = new_rem - 1 + 125
                if (rem > 7):
                    m_test = True
                    new_rem = rem-7
                    split_6 = new_rem - 1 + 138
                    x_cor_6 = space_coordinates[split_6 - 1][0]
                    y_cor_6 = space_coordinates[split_6 - 1][1]
                    piece_position = (x_cor_6, y_cor_6)
                    if (m_test == True):
                        combined_image = combined_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
            else:
                split_3 = rem - 1 + 121
                
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_3 = space_coordinates[split_3 - 1][0]
            y_cor_3 = space_coordinates[split_3 - 1][1]
            x_cor_orig = space_coordinates[8][0]
            y_cor_orig = space_coordinates[8][1]
            piece_position = (x_cor_1, y_cor_1)
            if (m_test == True):
                combined_image = combined_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_3, y_cor_3)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image4 = combined_image3.copy()
            combined_image4.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image4)
            ans = False
            while (ans == False):
                split = input("Would you like to continue through Kongo Jungle or move to Lake Orangatanga, or move to Gangplank Galleon, 1 for KJ, 2 for LO, 3 for GpG\n").lower()
                if (split == "1"):
                    cur_space = 10
                    ans = True
                elif (split == "2"):
                    cur_space = 254
                    ans = True
                elif (split == "3"):
                    cur_space = 121
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 124):
            m_test = False
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA")
            if (rem > 13):
                new_rem = rem - 13
                split_1 = new_rem - 1 + 52
            else:
                split_1 = rem-1+125
            if (rem > 3):
                if (3 < rem < 18):
                    m_test = True
                    split_2 = rem-1+271
                    new_rem = rem-3
                    split_3 = new_rem + 138 - 1
                    x_cor_3 = space_coordinates[split_3 - 1][0]
                    y_cor_3 = space_coordinates[split_3 - 1][1]
                    piece_position = (x_cor_3, y_cor_3)
                    combined_image = board_image.copy()
                    combined_image.paste(piece_image, piece_position, piece_image)
                elif (rem == 18):
                    m_test = True
                    split_3 = 152
                    split_2 = 338
                    x_cor_3 = space_coordinates[split_3 - 1][0]
                    y_cor_3 = space_coordinates[split_3 - 1][1]
                    piece_position = (x_cor_3, y_cor_3)
                    combined_image = board_image.copy()
                    combined_image.paste(piece_image, piece_position, piece_image)
                elif (rem > 18):
                    m_test = True
                    new_rem = rem-3
                    split_3 = new_rem + 138 - 1
                    new_rem = rem-18
                    split_2 = new_rem + 288 - 1
                    x_cor_3 = space_coordinates[split_3 - 1][0]
                    y_cor_3 = space_coordinates[split_3 - 1][1]
                    piece_position = (x_cor_3, y_cor_3)
                    combined_image = board_image.copy()
                    combined_image.paste(piece_image, piece_position, piece_image)
            else:
                split_2 = rem-1+271
            
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            
            x_cor_orig = space_coordinates[123][0]
            y_cor_orig = space_coordinates[123][1]
            piece_position = (x_cor_1, y_cor_1)
            if (m_test == True):
                combined_image = combined_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            ans = False
            while (ans == False):
                split = input("Would you like to continue through Gangplank Galleon or move to Kremwood Forest, 1 for GpG, 2 for KF\n").lower()
                if (split == "1"):
                    cur_space = 125
                    ans = True
                elif (split == "2"):
                    cur_space = 271
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 273):
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA")
            if (rem == 15):
                split_1 = 338
            elif (rem > 15):
                new_rem = rem - 15
                split_1 = new_rem - 1 + 288
            else:
                split_1 = rem-1+274
            if (rem > 17):
                new_rem = rem - 17
                split_2 = new_rem - 1 + 165
            else:
                split_2 = rem-1+138
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_orig = space_coordinates[272][0]
            y_cor_orig = space_coordinates[272][1]
            piece_position = (x_cor_1, y_cor_1)
            combined_image = board_image.copy()
            combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            ans = False
            while (ans == False):
                split = input("Would you like to continue through Kremwood Forest or move to Crocodile Core, 1 for KF, 2 for CrC\n").lower()
                if (split == "1"):
                    cur_space = 274
                    ans = True
                elif (split == "2"):
                    cur_space = 138
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 60):
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA")                  
            split_1 = rem-1+61
            if (rem > 17):
                new_rem = rem - 17
                split_2 = new_rem - 1 + 288
            else:
                split_2 = rem-1+322 
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_orig = space_coordinates[59][0]
            y_cor_orig = space_coordinates[59][1]
            piece_position = (x_cor_1, y_cor_1)
            combined_image = board_image.copy()
            combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            ans = False
            while (ans == False):
                split = input("Would you like move to Gorilla Glacier or K3, 1 for GG, 2 for K3\n").lower()
                if (split == "1"):
                    cur_space = 61
                    ans = True
                elif (split == "2"):
                    cur_space = 322
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 174):
            m_test = False
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA") 
            if (rem > 9):
                m_test = True
                if (rem > 17):
                    new_rem = rem - 17
                    split_1 = new_rem - 1 + 81
                else:
                    new_rem = rem - 9
                    split_1 = new_rem - 1 + 348
                new_rem = rem - 9
                split_4 = new_rem - 1 + 356
                x_cor_4 = space_coordinates[split_4 - 1][0]
                y_cor_4 = space_coordinates[split_4 - 1][1]
                piece_position = (x_cor_4, y_cor_4)
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                split_1 = rem-1+339
            split_2 = rem - 1 + 212
            if (rem > 17):
                new_rem = rem - 17
                split_3 = new_rem - 1 + 237
            else:
                split_3 = rem - 1 + 195
                
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_3 = space_coordinates[split_3 - 1][0]
            y_cor_3 = space_coordinates[split_3 - 1][1]
            x_cor_orig = space_coordinates[173][0]
            y_cor_orig = space_coordinates[173][1]
            piece_position = (x_cor_1, y_cor_1)
            if (m_test == True):
                combined_image = combined_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_3, y_cor_3)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image4 = combined_image3.copy()
            combined_image4.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image4)
            ans = False
            ans = False
            while (ans == False):
                split = input("Would you like to move to Razor Ridge, K. Rool's Keep, or Gloomy Gulch, 1 for RR, 2 for KRK, 3 for GlG\n").lower()
                if (split == "1"):
                    cur_space = 339
                    ans = True
                elif (split == "2"):
                    cur_space = 212
                    ans = True
                elif (split == "3"):
                    cur_space = 195
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 371):
            if (88 in built_levels) and (89 in built_levels) and (90 in built_levels) and (91 in built_levels) and (92 in built_levels) and (93 in built_levels) and (94 in built_levels) and (95 in built_levels) and (96 in built_levels) and (97 in built_levels) and (98 in built_levels) and (99 in built_levels) and (100 in built_levels) and (101 in built_levels) and (102 in built_levels) and (103 in built_levels) and (104 in built_levels) and (105 in built_levels) and (106 in built_levels) and (107 in built_levels) and (108 in built_levels) and (109 in built_levels) and (110 in built_levels) and (111 in built_levels) and (112 in built_levels) and (113 in built_levels) and (114 in built_levels) and (115 in built_levels) and (116 in built_levels) and (117 in built_levels) and (118 in built_levels) and (119 in built_levels) and (120 in built_levels) and (121 in built_levels) and (122 in built_levels) and (123 in built_levels) and (124 in built_levels) and (125 in built_levels) and (126 in built_levels) and (127 in built_levels) and (128 in built_levels) and (129 in built_levels) and (130 in built_levels) and (131 in built_levels) and (132 in built_levels) and (133 in built_levels) and (134 in built_levels) and (135 in built_levels) and (136 in built_levels) and (137 in built_levels) and (138 in built_levels) and (139 in built_levels) and (140 in built_levels) and (141 in built_levels) and (142 in built_levels):
                if (3 not in krool_counter):
                    m_test = False
                    board_image = Image.open("assets/Board/dim_board.png")
                    piece_image = Image.open("assets/Statics/Orange Star.png")
                    piece_image = piece_image.convert("RGBA") 
                    if (rem > 4):
                        m_test = True
                        new_rem = rem - 4
                        split_1 = new_rem - 1 + 393
                        split_3 = new_rem - 1 + 376
                        x_cor_3 = space_coordinates[split_3 - 1][0]
                        y_cor_3 = space_coordinates[split_3 - 1][1]
                        piece_position = (x_cor_3, y_cor_3)
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        split_1 = rem-1+372
                    if (rem > 9):
                        new_rem = rem - 9
                        split_2 = new_rem - 1 + 305
                    else:
                        if (rem == 1):
                            split_2 = 100
                        elif (rem == 2):
                            split_2 = 99
                        elif (rem == 3):
                            split_2 = 98
                        elif (rem == 4):
                            split_2 = 97
                        elif (rem == 5):
                            split_2 = 96
                        elif (rem == 6):
                            split_2 = 95
                        elif (rem == 7):
                            split_2 = 94
                        elif (rem == 8):
                            split_2 = 93
                        elif (rem == 9):
                            split_2 = 92
                        
                    x_cor_1 = space_coordinates[split_1 - 1][0]
                    y_cor_1 = space_coordinates[split_1 - 1][1]
                    x_cor_2 = space_coordinates[split_2 - 1][0]
                    y_cor_2 = space_coordinates[split_2 - 1][1]
                    x_cor_orig = space_coordinates[370][0]
                    y_cor_orig = space_coordinates[370][1]
                    piece_position = (x_cor_1, y_cor_1)
                    if (m_test == True):
                        combined_image = combined_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    piece_position = (x_cor_2, y_cor_2)
                    combined_image2 = combined_image.copy()
                    combined_image2.paste(piece_image, piece_position, piece_image)
                    piece_image2 = Image.open(picture)
                    piece_image2 = piece_image2.convert("RGBA")
                    piece_position = (x_cor_orig, y_cor_orig)
                    combined_image3 = combined_image2.copy()
                    combined_image3.paste(piece_image2, piece_position, piece_image2)
                    window.change_main_image(combined_image3)
                    ans = False
                    ans = False
                    k3_door = False
                    while (ans == False):
                        split = input("Would you like to fight Baron K. Roolenstein, 1 for Yes, 2 for No\n").lower()
                        if (split == "1"):
                            cur_space = 3
                            ans = True
                            k3_door = True
                            break
                            
                        elif (split == "2"):
                            cur_space = 372
                            ans = True
                        else:
                            ans = False
                    if (k3_door == True):
                        break
                else:
                    m_test = False
                    board_image = Image.open("assets/Board/dim_board.png")
                    piece_image = Image.open("assets/Statics/Orange Star.png")
                    piece_image = piece_image.convert("RGBA") 
                    if (rem > 4):
                        m_test = True
                        new_rem = rem - 4
                        split_1 = new_rem - 1 + 393
                        split_3 = new_rem - 1 + 376
                        x_cor_3 = space_coordinates[split_3 - 1][0]
                        y_cor_3 = space_coordinates[split_3 - 1][1]
                        piece_position = (x_cor_3, y_cor_3)
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        split_1 = rem-1+372
                    if (rem > 9):
                        new_rem = rem - 9
                        split_2 = new_rem - 1 + 305
                    else:
                        if (rem == 1):
                            split_2 = 100
                        elif (rem == 2):
                            split_2 = 99
                        elif (rem == 3):
                            split_2 = 98
                        elif (rem == 4):
                            split_2 = 97
                        elif (rem == 5):
                            split_2 = 96
                        elif (rem == 6):
                            split_2 = 95
                        elif (rem == 7):
                            split_2 = 94
                        elif (rem == 8):
                            split_2 = 93
                        elif (rem == 9):
                            split_2 = 92
                        
                    x_cor_1 = space_coordinates[split_1 - 1][0]
                    y_cor_1 = space_coordinates[split_1 - 1][1]
                    x_cor_2 = space_coordinates[split_2 - 1][0]
                    y_cor_2 = space_coordinates[split_2 - 1][1]
                    x_cor_orig = space_coordinates[370][0]
                    y_cor_orig = space_coordinates[370][1]
                    piece_position = (x_cor_1, y_cor_1)
                    if (m_test == True):
                        combined_image = combined_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    else:
                        combined_image = board_image.copy()
                        combined_image.paste(piece_image, piece_position, piece_image)
                    piece_position = (x_cor_2, y_cor_2)
                    combined_image2 = combined_image.copy()
                    combined_image2.paste(piece_image, piece_position, piece_image)
                    piece_image2 = Image.open(picture)
                    piece_image2 = piece_image2.convert("RGBA")
                    piece_position = (x_cor_orig, y_cor_orig)
                    combined_image3 = combined_image2.copy()
                    combined_image3.paste(piece_image2, piece_position, piece_image2)
                    window.change_main_image(combined_image3)
                    ans = False
                    while (ans == False):
                        split = input("Would you like to continue through Pacifica or move to Kremkroc Industries Inc., 1 for P, 2 for KII\n").lower()
                        if (split == "1"):
                            cur_space = 372
                            ans = True
                        elif (split == "2"):
                            cur_space = 100
                            ans = True
                        else:
                            ans = False
            else:
                m_test = False
                board_image = Image.open("assets/Board/dim_board.png")
                piece_image = Image.open("assets/Statics/Orange Star.png")
                piece_image = piece_image.convert("RGBA") 
                if (rem > 4):
                    m_test = True
                    new_rem = rem - 4
                    split_1 = new_rem - 1 + 393
                    split_3 = new_rem - 1 + 376
                    x_cor_3 = space_coordinates[split_3 - 1][0]
                    y_cor_3 = space_coordinates[split_3 - 1][1]
                    piece_position = (x_cor_3, y_cor_3)
                    combined_image = board_image.copy()
                    combined_image.paste(piece_image, piece_position, piece_image)
                else:
                    split_1 = rem-1+372
                if (rem > 9):
                    new_rem = rem - 9
                    split_2 = new_rem - 1 + 305
                else:
                    if (rem == 1):
                        split_2 = 100
                    elif (rem == 2):
                        split_2 = 99
                    elif (rem == 3):
                        split_2 = 98
                    elif (rem == 4):
                        split_2 = 97
                    elif (rem == 5):
                        split_2 = 96
                    elif (rem == 6):
                        split_2 = 95
                    elif (rem == 7):
                        split_2 = 94
                    elif (rem == 8):
                        split_2 = 93
                    elif (rem == 9):
                        split_2 = 92
                    
                x_cor_1 = space_coordinates[split_1 - 1][0]
                y_cor_1 = space_coordinates[split_1 - 1][1]
                x_cor_2 = space_coordinates[split_2 - 1][0]
                y_cor_2 = space_coordinates[split_2 - 1][1]
                x_cor_orig = space_coordinates[370][0]
                y_cor_orig = space_coordinates[370][1]
                piece_position = (x_cor_1, y_cor_1)
                if (m_test == True):
                    combined_image = combined_image.copy()
                    combined_image.paste(piece_image, piece_position, piece_image)
                else:
                    combined_image = board_image.copy()
                    combined_image.paste(piece_image, piece_position, piece_image)
                piece_position = (x_cor_2, y_cor_2)
                combined_image2 = combined_image.copy()
                combined_image2.paste(piece_image, piece_position, piece_image)
                piece_image2 = Image.open(picture)
                piece_image2 = piece_image2.convert("RGBA")
                piece_position = (x_cor_orig, y_cor_orig)
                combined_image3 = combined_image2.copy()
                combined_image3.paste(piece_image2, piece_position, piece_image2)
                window.change_main_image(combined_image3)
                ans = False
                ans = False
                while (ans == False):
                    split = input("Would you like to continue through Pacifica or move to Kremkroc Industries Inc., 1 for P, 2 for KII\n").lower()
                    if (split == "1"):
                        cur_space = 372
                        ans = True
                    elif (split == "2"):
                        cur_space = 100
                        ans = True
                    else:
                        ans = False
                print("")
        elif (cur_space == 375):
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA") 
            if (rem > 17):
                new_rem = rem - 17
                split_1 = new_rem - 1 + 232
            else:
                split_1 = rem-1+393
            if (rem > 17):
                new_rem = rem - 17
                split_2 = new_rem - 1 + 232
            else:
                split_2 = rem-1+376
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_orig = space_coordinates[374][0]
            y_cor_orig = space_coordinates[374][1]
            piece_position = (x_cor_1, y_cor_1)
            combined_image = board_image.copy()
            combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            ans = False
            while (ans == False):
                split = input("Would you like to move through Krematoa or KAOS Kore, 1 for K, 2 for KsK\n").lower()
                if (split == "1"):
                    cur_space = 393
                    ans = True
                elif (split == "2"):
                    cur_space = 376
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 347):
            m_test = False
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open("assets/Statics/Orange Star.png")
            piece_image = piece_image.convert("RGBA") 
            if (rem > 16):
                m_test = True
                new_rem = rem - 16
                split_1 = new_rem  - 1 + 372
                if (rem == 17):
                    split_3 = 100
                elif (rem == 18):
                    split_3 = 99
                elif (rem == 19):
                    split_3 = 98
                elif (rem == 20):
                    split_3 = 97
                x_cor_3 = space_coordinates[split_3 - 1][0]
                y_cor_3 = space_coordinates[split_3 - 1][1]
                piece_position = (x_cor_3, y_cor_3)
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                split_1 = rem-1+356
            if (rem > 8):
                new_rem = rem - 8
                split_2 = new_rem - 1 + 81
            else:
                split_2 = rem-1+348
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_orig = space_coordinates[346][0]
            y_cor_orig = space_coordinates[346][1]
            piece_position = (x_cor_1, y_cor_1)
            if (m_test == True):
                combined_image = combined_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            else:
                combined_image = board_image.copy()
                combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            ans = False
            while (ans == False):
                split = input("Would you like to continue through Razor Ridge or move to Pacifica, 1 for RR, 2 for P\n").lower()
                if (split == "1"):
                    cur_space = 348
                    ans = True
                elif (split == "2"):
                    cur_space = 356
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 304):
            board_image = Image.open("assets/Board/dim_board.png")
            piece_image = Image.open(("assets/Statics/Orange Star.png"))
            piece_image = piece_image.convert("RGBA") 
            split_1 = rem-1+101
            split_2 = rem-1+175
            x_cor_1 = space_coordinates[split_1 - 1][0]
            y_cor_1 = space_coordinates[split_1 - 1][1]
            x_cor_2 = space_coordinates[split_2 - 1][0]
            y_cor_2 = space_coordinates[split_2 - 1][1]
            x_cor_orig = space_coordinates[303][0]
            y_cor_orig = space_coordinates[303][1]
            piece_position = (x_cor_1, y_cor_1)
            combined_image = board_image.copy()
            combined_image.paste(piece_image, piece_position, piece_image)
            piece_position = (x_cor_2, y_cor_2)
            combined_image2 = combined_image.copy()
            combined_image2.paste(piece_image, piece_position, piece_image)
            piece_image2 = Image.open(picture)
            piece_image2 = piece_image2.convert("RGBA")
            piece_position = (x_cor_orig, y_cor_orig)
            combined_image3 = combined_image2.copy()
            combined_image3.paste(piece_image2, piece_position, piece_image2)
            window.change_main_image(combined_image3)
            ans = False
            while (ans == False):
                split = input("Would you move to Chimp Caverns or Krazy Kremland, 1 for CC, 2 for KK\n").lower()
                if (split == "1"):
                    cur_space = 101
                    ans = True
                elif (split == "2"):
                    cur_space = 175
                    ans = True
                else:
                    ans = False
            print("")
        elif (cur_space == 53):
            if (1 in built_levels) and (2 in built_levels) and (3 in built_levels) and (4 in built_levels) and (5 in built_levels) and (6 in built_levels) and (7 in built_levels) and (8 in built_levels) and (9 in built_levels) and (10 in built_levels) and (11 in built_levels) and (12 in built_levels) and (13 in built_levels) and (14 in built_levels) and (15 in built_levels) and (16 in built_levels) and (17 in built_levels) and (18 in built_levels) and (19 in built_levels) and (20 in built_levels) and (21 in built_levels) and (22 in built_levels) and (23 in built_levels) and (24 in built_levels) and (25 in built_levels) and (26 in built_levels) and (27 in built_levels) and (28 in built_levels) and (29 in built_levels) and (30 in built_levels) and (31 in built_levels) and (32 in built_levels) and (33 in built_levels) and (34 in built_levels) and (35 in built_levels) and (36 in built_levels) and (37 in built_levels) and (38 in built_levels) and (39 in built_levels) and (40 in built_levels):
                if (1 not in krool_counter):
                    ans = False
                    k1_door = False
                    while (ans == False):
                        split = input("Would to fight King K. Rool, 1 for Yes, 2 for No\n").lower()
                        if (split == "1"):
                            cur_space = 1
                            ans = True
                            k1_door = True
                            break
                            
                        elif (split == "2"):
                            cur_space = 54
                            ans = True
                        else:
                            ans = False
                    if (k1_door == True):
                        break
                else:
                    cur_space = 54
            else:
                cur_space = 54
        elif (cur_space == 1):
            if (1 not in krool_counter):
                ans = False
                k1_door = False
                while (ans == False):
                    split = input("\nWould you like to fight King K. Rool again, 1 for Yes, 2 for No\n").lower()
                    if (split == "1"):
                        cur_space = 1
                        ans = True
                        k1_door = True
                        break
                        
                    elif (split == "2"):
                        cur_space = 53
                        print("\nYou rolled a", roll)
                        print("")
                        ans = True
                    else:
                        ans = False
                if (k1_door == True):
                    break
            else:
                print("\nYou rolled a", roll)
                print("")
                cur_space = 53
        elif (cur_space == 172):
            if (41 in built_levels) and (42 in built_levels) and (43 in built_levels) and (44 in built_levels) and (45 in built_levels) and (46 in built_levels) and (47 in built_levels) and (48 in built_levels) and (49 in built_levels) and (50 in built_levels) and (51 in built_levels) and (52 in built_levels) and (53 in built_levels) and (54 in built_levels) and (55 in built_levels) and (56 in built_levels) and (57 in built_levels) and (58 in built_levels) and (59 in built_levels) and (60 in built_levels) and (61 in built_levels) and (62 in built_levels) and (63 in built_levels) and (64 in built_levels) and (65 in built_levels) and (66 in built_levels) and (67 in built_levels) and (68 in built_levels) and (69 in built_levels) and (70 in built_levels) and (71 in built_levels) and (72 in built_levels) and (73 in built_levels) and (74 in built_levels) and (75 in built_levels) and (76 in built_levels) and (77 in built_levels) and (78 in built_levels) and (79 in built_levels) and (80 in built_levels) and (81 in built_levels) and (82 in built_levels) and (83 in built_levels) and (84 in built_levels) and (85 in built_levels) and (86 in built_levels) and (87 in built_levels):
                if (2 not in krool_counter):
                    ans = False
                    k2_door = False
                    while (ans == False):
                        split = input("Would to fight Kaptain K. Rool, 1 for Yes, 2 for No\n").lower()
                        if (split == "1"):
                            cur_space = 2
                            ans = True
                            k2_door = True
                            break
                            
                        elif (split == "2"):
                            cur_space = 173
                            ans = True
                        else:
                            ans = False
                    if (k2_door == True):
                        break
                else:
                    cur_space = 173
            else:
                cur_space = 173
        elif (cur_space == 2):
            if (2 not in krool_counter):
                ans = False
                k2_door = False
                while (ans == False):
                    split = input("\nWould you like to fight Kaptain K. Rool again, 1 for Yes, 2 for No\n").lower()
                    if (split == "1"):
                        cur_space = 2
                        ans = True
                        k2_door = True
                        break
                        
                    elif (split == "2"):
                        cur_space = 172
                        print("\nYou rolled a", roll)
                        print("")
                        ans = True
                    else:
                        ans = False
                if (k2_door == True):
                    break
            else:
                print("\nYou rolled a", roll)
                print("")
                cur_space = 172
        elif (cur_space == 3):
            if (3 not in krool_counter):
                ans = False
                k3_door = False
                while (ans == False):
                    split = input("\nWould you like to fight Baron K. Roolenstein again, 1 for Yes, 2 for No\n").lower()
                    if (split == "1"):
                        cur_space = 3
                        ans = True
                        k3_door = True
                        break
                        
                    elif (split == "2"):
                        cur_space = 371
                        print("\nYou rolled a", roll)
                        print("")
                        ans = True
                    else:
                        ans = False
                if (k3_door == True):
                    break
            else:
                print("\nYou rolled a", roll)
                print("")
                cur_space = 371
        elif (cur_space == 295):
            queen = input("\nWould you like to visit Queen Banana Bird (Yes or No)\n").lower()
            if (queen == "yes"):
                cur_space = 4
                break
            else:
                cur_space = 296
        elif (cur_space == 4):
            cur_space = 295
        elif (cur_space == 40):
            cur_space = 140
        elif (cur_space == 231):
            cur_space = 347
        elif (cur_space == 154):
            cur_space = 165
        elif (cur_space == 137):
            cur_space = 52
        elif (cur_space == 23):
            cur_space = 41
        elif (cur_space == 80):
            cur_space = 155
        elif (cur_space == 270):
            cur_space = 288
        elif (cur_space == 287):
            cur_space = 338
        elif (cur_space == 355):
            cur_space = 81
        elif (cur_space == 338):
            cur_space = 288
        elif (cur_space == 120):
            cur_space = 81
        elif (cur_space == 92):
            cur_space = 305
        elif (cur_space == 253):
            cur_space = 363
        elif (cur_space == 194):
            cur_space = 237
        elif (cur_space == 211):
            cur_space = 237
        elif (cur_space == 236):
            cur_space = 6
        elif (cur_space == 409):
            cur_space = 232
        elif (cur_space == 392):
            cur_space = 232
        elif (cur_space == 321):
            cur_space = 232
        
            
        elif ((cur_space == 93) or (cur_space == 94)or (cur_space == 95)or (cur_space == 96)
            or (cur_space == 97)or (cur_space == 98)or (cur_space == 99)or (cur_space == 100)):
            cur_space -= 1
        else:
            cur_space += 1
        rem -= 1
        roll_count += 1
    
    new_space = cur_space
  
    return new_space, pass_start


def dice_roll(die):
    roll = random.randint(1, die)
    return roll


def level_check(inventory, level_list, bonus_coin_count, money):
    options = []
    possible_levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
                       71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142]
    for levels in level_list:
        opt = 0
        for opts in possible_levels:
            if opts == levels:
                possible_levels.pop(opt)
            opt += 1
    
    for levels in possible_levels:
        materials = material_list[levels-1]
        m_test = True
        money_test = False
        for req in materials:
            if req in inventory:
                pass
            else:
                m_test = False
                break
        money_test = True
        if m_test == True:
            if (money_test == True):
                if levels == 39 or levels == 136:
                    count = operator.countOf(inventory,'Boss')
                    if (count > 1):
                        options.append(levels)
                elif (levels == 82) or (levels == 83) or (levels == 84) or (levels == 85) or (levels == 86) or (levels == 87) or (levels == 137) or (levels == 138) or (levels == 139) or (levels == 140) or (levels == 141) or (levels == 142):
                    if (bonus_coin_count > 1):
                        options.append(levels)
                else:
                    options.append(levels)
    return options
def name_check(name):

    
    if (name in name_list):
        return True
    else:
        return False
name_list = ["Clapper",
                 "Ellie",
                 "Enguarde",
                 "Expresso",
                 "Glimmer",
                 "Parry",
                 "Quawks",
                 "Rambi",
                 "Rattly",
                 "Squawks",
                 "Squitter",
                 "Winky",
                 "Banana Hoard",
                 "Barn",
                 "Beehive",
                 "Brambles",
                 "Castle",
                 "Caves",
                 "Cliffs",
                 "Coral Reef",
                 "Docks",
                 "Factory",
                 "Forest",
                 "Glacier",
                 "Gunship",
                 "Ice Cave",
                 "Jungle",
                 "Library",
                 "Mines",
                 "Pipes",
                 "Rigging",
                 "River",
                 "Scaffolding",
                 "Ship Deck",
                 "Ship Hold",
                 "Swamp",
                 "Temple",
                 "Theme Park",
                 "Trees",
                 "Volcano",
                 "Waterfall",
                 "Balloons",
                 "Barrel Cannons",
                 "Barrels",
                 "Boss",
                 "Carts",
                 "Chase",
                 "Conveyors",
                 "Doors",
                 "Drums",
                 "Fire",
                 "Gauntlet",
                 "Ghosts",
                 "Hooks",
                 "Krockheads",
                 "Lights",
                 "Millstones",
                 "Mincers",
                 "Poison",
                 "Rising Danger",
                 "Ropes",
                 "Spawners",
                 "Storm",
                 "Tires",
                 "Water",
                 "Wind"]
animal_list = [
    "Clapper",
    "Ellie",
    "Enguarde",
    "Expresso",
    "Glimmer",
    "Parry",
    "Quawks",
    "Rambi",
    "Rattly",
    "Squawks",
    "Squitter",
    "Winky"
    ]
resource_list = [
    "Balloons",
    "Barrel Cannons",
    "Barrels",
    "Boss",
    "Carts",
    "Chase",
    "Conveyors",
    "Doors",
    "Drums",
    "Fire",
    "Gauntlet",
    "Ghosts",
    "Hooks",
    "Krockheads",
    "Lights",
    "Millstones",
    "Mincers",
    "Poison",
    "Rising Danger",
    "Ropes",
    "Spawners",
    "Storm",
    "Tires",
    "Water",
    "Wind"
    ]
enviornment_list = [
    "Banana Hoard",
    "Barn",
    "Beehive",
    "Brambles",
    "Castle",
    "Caves",
    "Cliffs",
    "Coral Reef",
    "Docks",
    "Factory",
    "Forest",
    "Glacier",
    "Gunship",
    "Ice Cave",
    "Jungle",
    "Library",
    "Mines",
    "Pipes",
    "Rigging",
    "River",
    "Scaffolding",
    "Ship Deck",
    "Ship Hold",
    "Swamp",
    "Temple",
    "Theme Park",
    "Trees",
    "Volcano"
    ]
space_coordinates = [
    [2515, 935], #King K. Rool
    [1362, 1630], #Kaptain K. Rool
    [139, 919], #Baron K. Roolenstein
    [1378, 1330], #Queen Banana Bird
    [1339, 305], #Finish
    [1341, 125], #Start / Candy's Save Point
    #Kongo Jungle
    [1464, 122], #Banana Hoard, Jungle, Water
    [1540, 121], #Camera Piece #8
    [1618, 135], #DKC Bonus #9
    [1690, 119], #10
    [1764, 120], #11
    [1840, 121], #12
    [1915, 115], #13
    [1991, 97], #14
    [2059, 96], #15
    [2131, 113], #16
    [2204, 136], #17
    [2281, 141], #18
    [2348, 126], #19
    [2420, 117], #20
    [2493, 115], #21
    [2548, 152], #22
    [2553, 218], #23
    #Monkey Mines
    [1859, 192], #24
    [1918, 259], #25
    [1969, 323], #26
    [2027, 388], #27
    [2081, 337], #28
    [2137, 290], #29
    [2211, 266], #30
    [2295, 260], #31
    [2309, 321], #32
    [2313, 385], #33
    [2321, 446], #34
    [2245, 460], #35
    [2175, 467], #36
    [2131, 522], #37
    [2096, 582], #38
    [2056, 648], #39
    [2017, 706], #40
    #Vine Valley
    [2523, 284], #41
    [2475, 335], #42
    [2516, 386], #43
    [2546, 440], #44
    [2502, 493], #45
    [2463, 548], #46
    [2506, 613], #47
    [2549, 672], #48
    [2516, 727], #49
    [2465, 779], #50
    [2413, 832], #51
    [2395, 904], #52
    [2417, 974], #53
    [2466, 1031], #54
    [2520, 1071], #55
    [2578, 1114], #56
    [2538, 1170], #57
    [2501, 1225], #58
    [2465, 1283], #59
    [2425, 1348], #60
    #Gorilla Glacier
    [2416, 1417], #61
    [2450, 1484], #62
    [2490, 1539], #63
    [2526, 1614], #64
    [2458, 1644], #65
    [2388, 1670], #66
    [2320, 1701], #67
    [2255, 1732], #68
    [2187, 1755], #69
    [2107, 1747], #70
    [2032, 1732], #71
    [1965, 1722], #72
    [1895, 1703], #73
    [1903, 1631], #74
    [1903, 1552], #75
    [1982, 1549], #76
    [2052, 1564], #77
    [2122, 1594], #78
    [2196, 1570], #79
    [2241, 1510], #80
    #Kremkroc Industries Inc.
    [1159, 803], #81
    [1091, 800], #82
    [1025, 799], #83
    [961, 791], #84
    [898, 742], #85
    [849, 799], #86
    [808, 860], #87
    [735, 872], #88
    [652, 875], #89
    [651, 795], #90
    [652, 723], #91
    [652, 650], #92
    [576, 671], #93
    [513, 717], #94
    [473, 658], #95
    [404, 707], #96
    [343, 739], #97
    [358, 805], #98
    [373, 876], #99
    [306, 896], #100
    #Chimp Caverns
    [1287, 870], #101
    [1345, 831], #102
    [1348, 769], #103
    [1308, 714], #104
    [1268, 659], #105
    [1280, 597], #106
    [1332, 559], #107
    [1324, 498], #108
    [1255, 503], #109
    [1182, 520], #110
    [1130, 465], #111
    [1060, 440], #112
    [1010, 485], #113
    [958, 528], #114
    [952, 587], #115
    [999, 633], #116
    [1061, 615], #117
    [1128, 618], #118
    [1168, 662], #119
    [1162, 722], #120
    #Gangplank Galleon
    [1663, 218], #121
    [1718, 278], #122
    [1770, 332], #123
    [1823, 394], #124
    [1888, 451], #125
    [1928, 495], #126
    [1972, 541], #127
    [2021, 576], #128
    [2185, 601], #129
    [2259, 606], #130
    [2326, 635], #131
    [2294, 699], #132
    [2223, 722], #133
    [2159, 766], #134
    [2157, 830], #135
    [2230, 860], #136
    [2302, 869], #137
    #Crocodile Cauldron
    [1862, 676], #138
    [1915, 718], #139
    [1970, 764], #140
    [2025, 821], #141
    [2039, 887], #142
    [2100, 951], #143
    [2116, 1018], #144
    [2115, 1095], #145
    [2048, 1108], #146
    [1975, 1096], #147
    [1897, 1067], #148
    [1822, 1090], #149
    [1744, 1227], #159
    [1691, 1280], #151
    [1629, 1327], #152
    [1584, 1396], #153
    [1629, 1459], #154
    #Krem Quay
    [2243, 1440], #155
    [2206, 1379], #156
    [2140, 1352], #157
    [2070, 1369], #158
    [2008, 1403], #159
    [1942, 1417], #160
    [1881, 1383], #161
    [1827, 1332], #162
    [1765, 1349], #163
    [1732, 1421], #164
    [1717, 1501], #165
    [1714, 1598], #166
    [1709, 1681], #167
    [1628, 1660], #168
    [1574, 1611], #169
    [1518, 1567], #170
    [1441, 1558], #171
    [1367, 1563], #172
    [1292, 1561], #173
    [1223, 1563], #174
    #Krazy Kremland
    [1359, 1005], #175
    [1368, 1057], #176
    [1331, 1105], #177
    [1276, 1115], #178
    [1184, 1003], #179
    [1119, 1007], #180
    [1075, 1056], #181
    [1022, 1096], #182
    [984, 1149], #183
    [933, 1193], #184
    [884, 1235], #185
    [837, 1283], #186
    [791, 1328], #187
    [748, 1372], #188
    [695, 1414], #189
    [650, 1461], #190
    [598, 1506], #191
    [548, 1554], #192
    [493, 1584], #193
    [428, 1614], #194
    #Gloomy Gulch
    [1193, 1645], #195
    [1127, 1653], #196
    [1147, 1715], #197
    [1180, 1786], #198
    [1106, 1789], #199
    [1034, 1783], #200
    [959, 1783], #201
    [885, 1783], #202
    [826, 1744], #203
    [819, 1667], #204
    [751, 1670], #205
    [728, 1750], #206
    [656, 1789], #207
    [574, 1792], #208
    [498, 1788], #209
    [417, 1786], #210
    [421, 1719], #211
    #K. Rool's Keep
    [1145, 1560], #212
    [1085, 1562], #213
    [1022, 1567], #214
    [1010, 1633], #215
    [931, 1632], #216
    [936, 1558], #217
    [966, 1478], #218
    [892, 1469], #219
    [828, 1490], #220
    [765, 1542], #221
    [691, 1588], #222
    [619, 1603], #223
    [566, 1430], #224
    [580, 1368], #225
    [651, 1308], #226
    [590, 1248], #227
    [523, 1304], #228
    [448, 1261], #229
    [492, 1209], #230
    [538, 1162], #231
    #The Flying Krock
    [880, 128], #232
    [979, 124], #233
    [1056, 118], #234
    [1134, 122], #235
    [1210, 121], #236
    #Lost World
    [360, 1661], #237
    [284, 1662], #238
    [240, 1719], #239
    [241, 1788], #240
    [168, 1793], #241
    [96, 1791], #242
    [93, 1720], #243
    [94, 1644], #244
    [95, 1571], #245
    [100, 1498], #246
    [165, 1502], #247
    [231, 1531], #248
    [305, 1495], #249
    [377, 1515], #250
    [441, 1478], #251
    [426, 1408], #252
    [362, 1372], #253
    #Lake Orangatanga
    [1572, 216], #254
    [1526, 269], #255
    [1548, 329], #256
    [1589, 384], #257
    [1628, 438], #258
    [1670, 495], #259
    [1710, 555], #260
    [1647, 598], #261
    [1605, 540], #262
    [1547, 509], #263
    [1474, 513], #264
    [1477, 586], #265
    [1475, 651], #266
    [1475, 722], #267
    [1475, 791], #268
    [1478, 860], #269
    [1475, 931], #270
    #Kremwood Forest
    [1802, 475], #271
    [1807, 542], #272
    [1810, 615], #273
    [1762, 690], #274
    [1739, 751], #275
    [1797, 793], #276
    [1863, 832], #277
    [1893, 894], #278
    [1866, 958], #279
    [1805, 971], #280
    [1747, 942], #281
    [1712, 882], #282
    [1684, 821], #283
    [1634, 788], #284
    [1581, 821], #285
    [1588, 879], #286
    [1615, 935], #287
    #Cotton-Top Cove
    [1472, 1023], #288
    [1492, 1108], #289
    [1530, 1177], #290
    [1537, 1242], #291
    [1505, 1305], #292
    [1478, 1366], #293
    [1440, 1423], #294
    [1365, 1429], #295
    [1288, 1422], #296
    [1239, 1371], #297
    [1203, 1311], #298
    [1165, 1245], #299
    [1158, 1179], #300
    [1197, 1113], #301
    [1233, 1043], #302
    [1269, 979], #303
    [1322, 939], #304
    #Mekanos
    [735, 644], #305
    [791, 593], #306
    [845, 543], #307
    [852, 476], #308
    [781, 474], #309
    [709, 466], #310
    [649, 509], #311
    [583, 512], #312
    [580, 444], #313
    [580, 372], #314
    [661, 368], #315
    [735, 366], #316
    [809, 365], #317
    [890, 367], #318
    [963, 367], #319
    [952, 294], #320
    [888, 233], #321
    #K3
    [2351, 1304], #322
    [2340, 1228], #323
    [2323, 1146], #324
    [2315, 1077], #325
    [2248, 1071], #326
    [2230, 1146], #327
    [2209, 1218], #328
    [2139, 1227], #329
    [2070, 1225], #330
    [2005, 1219], #331
    [1927, 1219], #332
    [1866, 1212], #333
    [1807, 1174], #334
    [1743, 1138], #335
    [1682, 1105], #336
    [1645, 1043], #337
    [1571, 1003], #338
    #Razor Ridge
    [1184, 1467], #339
    [1130, 1422], #340
    [1077, 1373], #341
    [1024, 1318], #342
    [963, 1274], #343
    [815, 1201], #344
    [739, 1177], #345
    [669, 1149], #346
    [598, 1109], #347
    [658, 1055], #348
    [730, 1028], #349
    [804, 998], #350
    [870, 977], #351
    [944, 958], #352
    [1014, 931], #353
    [1088, 914], #354
    [1148, 873], #355
    #Pacifica
    [531, 1048], #356
    [477, 994], #357
    [391, 984], #358
    [341, 1052], #359
    [353, 1121], #360
    [349, 1206], #361
    [324, 1277], #362
    [269, 1353], #363
    [189, 1354], #364
    [114, 1315], #365
    [98, 1245], #366
    [118, 1169], #367
    [172, 1109], #368
    [216, 1045], #369
    [228, 975], #370
    [227, 910], #371
    [205, 836], #372
    [177, 768], #373
    [148, 696], #374
    [132, 608], #375
    #KAOS Kore
    [221, 579], #376
    [289, 589], #377
    [353, 566], #378
    [362, 504], #379
    [443, 492], #380
    [450, 413], #381
    [376, 399], #382
    [352, 339], #383
    [332, 269], #384
    [355, 199], #385
    [422, 156], #386
    [491, 159], #387
    [533, 216], #388
    [603, 195], #389
    [673, 200], #390
    [737, 220], #391
    [792, 183], #392
    #Krematoa
    [127, 524], #393
    [144, 452], #394
    [155, 373], #395
    [170, 308], #396
    [172, 233], #397
    [105, 222], #398
    [77, 164], #399
    [138, 114], #400
    [207, 135], #401
    [279, 130], #402
    [342, 94], #403
    [414, 67], #404
    [488, 66], #405
    [567, 77], #406
    [635, 80], #407
    [711, 79], #408
    [787, 83] #409
    ]
full_space_guide = [
    
    ["King K. Rool"], #1
    ["Kaptain K. Rool"], #2
    ["Baron K. Roolenstein"], #3
    ["Queen Banana Bird"], #4
    ["Finish"], #5
    ["Candy's Save Point"], #6
    #Kongo Jungle
    ["M", "Banana Hoard", "Jungle", "Water"], #7
    ["Camera Piece"], #8
    ["DKC Bonus"], #9
    ["Wrinkly's Kong Kollege"], #10
    ["M", "Barrel Cannons", "Tires", "Rambi"], #11
    ["ANY Bonus"], #12
    ["Funky's Flights"], #13
    ["Camera Piece"], #14
    ["M", "Enguarde", "Banana Hoard", "Ropes"], #15
    ["DKC Bonus"], #16
    ["Crystal Coconut"], #17
    ["Cranky's Cabin"], #18
    ["M", "Jungle", "Balloons", "Boss"], #19
    ["Camera Piece"], #20
    ["Bazaar's General Store"], #21
    ["M", "Caves", "Coral Reef", "Storm"], #22
    ["Swanky's Bonus Bonanza"], #23
    #Monkey Mines
    ["M", "Caves", "Carts", "Drums"], #24
    ["M", "Mines", "Scaffolding", "Tires"], #25
    ["Camera Piece"], #26
    ["DKC Bonus"], #27
    ["Swanky's Bonus Bonanza"], #28
    ["Wrinkly's Kong Kollege"], #29
    ["Camera Piece"], #30
    ["M", "Barrels", "Gauntlet", "Millstones"], #31
    ["M", "Mines", "Boss", "Winky"], #32
    ["Funky's Flights"], #33
    ["Candy's Save Point"], #34
    ["M", "Temple", "Lights", "Tires"], #35
    ["DKC Bonus"], #36
    ["Camera Piece"], #37
    ["Cranky's Cabin"], #38
    ["DKC Bonus"], #39
    ["M", "Banana Hoard", "Spawners", "Winky"], #40
    #Vine Valley
    ["M", "Forest", "Jungle", "Ropes"], #41
    ["Lose a Life"], #42
    ["Funky's Flights"], #43
    ["DKC Bonus"], #44
    ["M", "Trees", "Gauntlet", "Expresso"], #45
    ["M", "Barrel Cannons", "Enguarde", "Chase"], #46
    ["Camera Piece"], #47
    ["M", "Ropes", "Millstones", "Water"], #48
    ["M", "Coral Reef", "Balloons", "Barrels"], #49
    ["Wrinkly's Kong Kollege"], #50
    ["Cranky's Cabin"], #51
    ["DKC Bonus"], #52
    ["M", "Forest", "Barrels", "Boss"], #53
    ["Camera Piece"], #54
    ["Candy's Save Point"], #55
    ["DKC Bonus"], #56
    ["M", "Temple", "Gauntlet", "Enguarde"], #57
    ["Camera Piece"], #58
    ["Bramble's Bungalow"], #59
    ["M", "Banana Hoard", "Barrel Cannons", "Expresso"], #60
    #Gorilla Glacier
    ["DKC Bonus"], #61
    ["M", "Caves", "Ropes", "Storm"], #62
    ["Camera Piece"], #63
    ["M", "Glacier", "Drums", "Tires"], #64
    ["M", "Ice Cave", "Barrel Cannons", "Winky"], #65
    ["Cranky's Cabin"], #66
    ["Camera Piece"], #67
    ["Wrinkly's Kong Kollege"], #68
    ["Blizzard's Basecamp"], #69
    ["M", "Boss", "Water", "Winky"], #70
    ["Lose a Life"], #71
    ["M", "Glacier", "Conveyors", "Squawks"], #72
    ["Camera Piece"], #73
    ["M", "Coral Reef", "Lights", "Ropes"], #74
    ["M", "Caves", "Fire", "Expresso"], #75
    ["ANY Bonus"], #76
    ["Candy's Save Point"], #77
    ["DKC Bonus"], #78
    ["M", "Trees", "Chase", "Storm"], #79
    ["M", "Banana Hoard", "Mincers", "Water"], #80
    #Kremkroc Industries Inc.
    ["ANY Bonus"], #81
    ["Funky's Flights"], #82
    ["M", "Drums", "Gauntlet", "Ropes"], #83
    ["Camera Piece"], #84
    ["M", "Factory", "Conveyors", "Spawners"], #85
    ["DKC Bonus"], #86
    ["M", "Poison", "Scaffolding", "Rambi"], #87
    ["M", "Balloons", "Conveyors", "Gauntlet"], #88
    ["Crystal Coconut"], #89
    ["M", "Coral Reef", "Drums", "Lights"], #90
    ["M", "Banana Hoard", "Conveyors", "Water"], #91
    ["Lose a Life"], #92
    ["M", "Scaffolding", "Mincers", "Boss"], #93
    ["Wrinkly's Kong Kollege"], #94
    ["DKC Bonus"], #95
    ["M", "Gauntlet", "Spawners", "Tires"], #96
    ["Cranky's Cabin"], #97
    ["M", "Caves", "Fire", "Drums"], #98
    ["Camera Piece"], #99
    ["M", "Factory", "Carts", "Enguarde"], #100
    #Chimp Caverns
    ["M", "Caves", "Boss", "Drums"], #101
    ["Camera Piece"], #102
    ["DKC Bonus"], #103
    ["Crystal Coconut"], #104
    ["M", "Banana Hoard", "Gauntlet", "Lights"], #105
    ["M", "Tires", "Expresso", "Conveyors"], #106
    ["Camera Piece"], #107
    ["Cranky's Cabin"], #108
    ["DKC Bonus"], #109
    ["M", "Boss", "Spawners", "Scaffolding"], #110
    ["Candy's Save Point"], #111
    ["M", "Barrels", "Mincers", "Drums"], #112
    ["Camera Piece"], #113
    ["DKC Bonus"], #114
    ["M", "Mines", "Barrels", "Boss"], #115
    ["Wrinkly's Kong Kollege"], #116
    ["Blunder's Booth"], #117
    ["M", "Scaffolding", "Ropes", "Ship Deck"], #118
    ["Swanky's Bonus Bonanza"], #119
    ["M", "Mines", "Conveyors", "Rambi"], #120
    #Gangplank Galleon
    ["M", "Ship Deck", "Enguarde", "Storm"], #121
    ["M", "Ship Hold", "Hooks", "Ropes"], #122
    ["DKC2 Bonus"], #123
    ["Golden Feather"], #124
    ["M", "Boss", "Ropes", "Rattly"], #125
    ["M", "Ship Deck", "Rigging", "Water"], #126
    ["DKC2 Bonus"], #127
    ["Golden Feather"], #128
    ["Wrinkly's Kong Kollege"], #129
    ["M", "Rigging", "Doors", "Hooks"], #130
    ["Funky's Flights"], #131
    ["Crystal Coconut"], #132
    ["M", "Water", "Rigging", "Rambi"], #133
    ["Cranky's Cabin"], #134
    ["ANY Bonus"], #135
    ["Lose a Life"], #136
    ["Golden Feather"], #137
    #Crocodile Cauldron
    ["M", "Hooks", "Volcano", "Water"], #138
    ["DKC2 Bonus"], #139
    ["M", "Mines", "Krockheads", "Enguarde"], #140
    ["Golden Feather"], #141
    ["M", "Ship Hold", "Barrel Cannons", "Fire"], #142
    ["M", "Boss", "Balloons", "Gauntlet"], #143
    ["Swanky's Bonus Bonanza"], #144
    ["M", "Squawks", "Volcano", "Mines"], #145
    ["Lose a Life"], #146
    ["M", "Barrel Cannons", "Gauntlet", "Rambi"], #147
    ["ANY Bonus"], #148
    ["Golden Feather"], #149
    ["M", "Fire", "Squitter", "Wind"], #159
    ["Cranky's Cabin"], #151
    ["DKC2 Bonus"], #152
    ["Candy's Save Point"], #153
    ["M", "Volcano", "Barrels", "Clapper"], #154
    #Krem Quay
    ["Golden Feather"], #155
    ["M", "Barrels", "Brambles", "Water"], #156
    ["Swanky's Bonus Bonanza"], #157
    ["M", "Rising Danger", "Gauntlet", "Swamp"], #158
    ["M", "Boss", "Water", "Glimmer"], #159
    ["Cranky's Cabin"], #160
    ["DKC2 Bonus"], #161
    ["M", "Barrel Cannons", "Gauntlet", "Rigging"], #162
    ["Wrinkly's Kong Kollege"], #163
    ["M", "Ship Deck", "Barrels", "Lights"], #164
    ["M", "Swamp", "Barrel Cannons", "Ropes"], #165
    ["Funky's Flights"], #166
    ["Golden Feather"], #167
    ["M", "Ship Hold", "Ropes", "Rambi"], #168
    ["DKC2 Bonus"], #169
    ["Golden Feather"], #170
    ["Lose a Life"], #171
    ["M", "Swamp", "Chase", "Rattly"], #172
    ["M", "Krockheads", "Squawks", "Squitter"], #173
    ["ANY Bonus"], #174
    #Krazy Kremland
    ["Golden Feather"], #175
    ["M", "Chase", "Squawks", "Rambi"], #176
    ["Wrinkly's Kong Kollege"], #177
    ["M", "Doors", "Hooks", "Beehive"], #178
    ["M", "Chase", "Beehive", "Ropes"], #179
    ["Golden Feather"], #180
    ["M", "Carts", "Brambles", "Hooks"], #181
    ["DKC2 Bonus"], #182
    ["Candy's Save Point"], #183
    ["M", "Squitter", "Gauntlet", "Theme Park"], #184
    ["Swanky's Bonus Bonanza"], #185
    ["M", "Barrels", "Krockheads", "Squitter"], #186
    ["M", "Swamp", "Squawks", "Gauntlet"], #187
    ["Cranky's Cabin"], #188
    ["Golden Feather"], #189
    ["ANY Bonus"], #190
    ["M", "Boss", "Hooks", "Theme Park"], #191
    ["M", "Carts", "Squawks", "Beehive"], #192
    ["DKC2 Bonus"], #193
    ["Funky's Flights"], #194
    #Gloomy Gulch
    ["M", "Forest", "Gauntlet", "Chase"], #195
    ["M", "Carts", "Ghosts", "Rattly"], #196
    ["M", "Library", "Ropes", "Boss"], #197
    ["Candy's Save Point"], #198
    ["Golden Feather"], #199
    ["DKC2 Bonus"], #200
    ["M", "Rigging", "Ghosts", "Squitter"], #201
    ["M", "Forest", "Doors", "Ropes"], #202
    ["Wrinkly's Kong Kollege"], #203
    ["Crystal Coconut"], #204
    ["DKC2 Bonus"], #205
    ["Funky's Flights"], #206
    ["Cranky's Cabin"], #207
    ["M", "Beehive", "Ghosts", "Wind"], #208
    ["M", "Quawks", "Squawks", "Gauntlet"], #209
    ["Golden Feather"], #210
    ["Forest", "Barrels", "Storm"], #211
    #K. Rool's Keep
    ["M", "Poison", "Water", "Clapper"], #212
    ["M", "Mines", "Hooks", "Rising Danger"], #213
    ["M", "Fire", "Castle", "Squitter"], #214
    ["DKC2 Bonus"], #215
    ["Benny's Chairlift"], #216
    ["Wrinkly's Kong Kollege"], #217
    ["Golden Feather"], #218
    ["M", "Ice Cave", "Squawks", "Boss"], #219
    ["DKC2 Bonus"], #220
    ["M", "Castle", "Gauntlet", "Chase"], #221
    ["Cranky's Cabin"], #222
    ["M", "Water", "Barrel Cannons", "Gauntlet"], #223
    ["Swanky's Bonus Bonanza"], #224
    ["M", "Rising Danger", "Enguarde", "Rambi"], #225
    ["M", "Gauntlet", "Hooks", "Enguarde"], #226
    ["M", "Castle", "Ice Cave", "Wind"], #227
    ["Golden Feather"], #228
    ["M", "Castle", "Squawks", "Ropes"], #229
    ["Funky's Flights"], #230
    ["M", "Gauntlet", "Krockheads", "Rattly"], #231
    #The Flying Krock
    ["ANY Bonus"], #232
    ["M","Gauntlet", "Poison", "Spawners"], #233
    ["M", "Brambles", "Boss", "Squawks"], #234
    ["DKC2 Bonus"], #235
    ["M", "Chase", "Wind", "Squawks"], #236
    #Lost World
    ["ANY Bonus"], #237
    ["M", "Jungle", "Boss", "Wind"], #238
    ["M", "Barrel Cannons", "Gauntlet", "Squitter"], #239
    ["Golden Feather"], #240
    ["M", "Brambles", "Gauntlet", "Spawners"], #241
    ["Cranky's Cabin"], #242
    ["M", "Ice Cave", "Volcano", "Barrels"], #243
    ["DKC2 Bonus"], #244
    ["M", "Poison", "Enguarde", "Squawks"], #245
    ["Candy's Save Point"], #246
    ["M", "Jungle", "Ice Cave", "Rambi"], #247
    ["Crystal Coconut"], #248
    ["DKC2 Bonus"], #249
    ["M", "Tires", "Barrel Cannons", "Temple"], #250
    ["M", "Volcano", "Gauntlet", "Water"], #251
    ["Golden Feather"], #252
    ["M", "Jungle", "Barrels", "Rattly"], #253
    #Lake Orangatanga
    ["M", "Docks", "Spawners", "Barrels"], #254
    ["M", "Doors", "Water", "Ellie"], #255
    ["ANY Bonus"], #256
    ["Banana Bird"], #257
    ["Bachelor's Pad"], #258
    ["M", "Barn", "Glacier", "Barrels"], #259
    ["Cranky's Cabin"], #260
    ["Banana Bird"], #261
    ["DKC3 Bonus"], #262
    ["M", "Barn", "Boss", "Water"], #263
    ["M", "Mincers", "Storm", "Ellie"], #264
    ["Swanky's Bonus Bonanza"], #265
    ["Crystal Coconut"], #266
    ["Wrinkly's Kong Kollege"], #267
    ["M", "Docks", "Hooks", "Lights"], #268
    ["DKC3 Bonus"], #269
    ["M", "Barn","Balloons", "Enguarde"], #270
    #Kremwood Forest
    ["M", "Trees", "Chase", "Millstones"], #271
    ["M", "River", "Gauntlet", "Squawks"], #272
    ["DKC3 Bonus"], #273
    ["M", "Trees", "Barrels", "Ellie"], #274
    ["Candy's Save Point"], #275
    ["Banana Bird"], #276
    ["M", "Barn", "Chase", "Gauntlet"], #277
    ["Funky's Flights"], #278
    ["M", "Conveyors", "Barrels", "Doors"], #279
    ["Cranky's Cabin"], #280
    ["M", "Trees", "Water", "Parry"], #281
    ["DKC3 Bonus"], #282
    ["Brash's Stadium"], #283
    ["Swanky's Bonus Bonanza"], #284
    ["Banana Bird"], #285
    ["M", "River", "Barrels", "Ropes"], #286
    ["M", "Barrels", "Boss", "Water"], #287
    #Cotton-Top Cove
    ["Candy's Save Point"], #288
    ["M", "Coral Reef", "Barrel Cannons", "Water"], #289
    ["M", "Waterfall", "Spawners", "Boss"], #290
    ["Banana Bird"], #291
    ["M", "Waterfall", "Ropes", "Water"], #292
    ["M", "Barrel Cannons", "Water", "Ellie"], #293
    ["Cranky's Cabin"], #294
    ["M", "Coral Reef", "Chase", "Ellie"], #295
    ["Crystal Coconut"], #296
    ["M", "Waterfall", "Chase", "Enguarde"], #297
    ["DKC3 Bonus"], #298
    ["Blue's Beach Hut"], #299
    ["M", "Docks", "Water", "Wind"], #300
    ["Funky's Flights"], #301
    ["M", "Gauntlet", "Water", "Parry"], #302
    ["Lose a Life"], #303
    ["ANY Bonus"], #304
    #Mekanos
    ["Candy's Save Point"], #305
    ["M", "Factory", "Squawks", "Carts"], #306
    ["ANY Bonus"], #307
    ["M", "Fire", "Pipes", "Barrels"], #308
    ["M", "Ropes", "Poison", "Squitter"], #309
    ["Cranky's Cabin"], #310
    ["Banana Bird"], #311
    ["M", "Gauntlet", "Factory", "Trees"], #312
    ["Bazooka's Barracks"], #313
    ["M", "Barrel Cannons", "Gauntlet", "Quawks"], #314
    ["DKC3 Bonus"], #315
    ["Funky's Flights"], #316
    ["Wrinkly's Kong Kollege"], #317
    ["Banana Bird"], #318
    ["M", "Hooks", "Ropes", "Fire"], #319
    ["M", "Pipes", "Rising Danger", "Squitter"], #320
    ["M", "Factory", "Barrels", "Boss"], #321
    #K3
    ["Cranky's Cabin"], #322
    ["M", "Factory", "Glacier", "Gauntlet"], #323
    ["M", "Boss", "Spawners", "Storm"], #324
    ["Banana Bird"], #325
    ["M", "Barrels", "Squitter", "Waterfall"], #326
    ["DKC3 Bonus"], #327
    ["M", "Glacier", "Fire", "Parry"], #328
    ["Funky's Flights"], #329
    ["Crystal Coconut"], #330
    ["M", "Cliffs", "Carts", "Storm"], #331
    ["DKC3 Bonus"], #332
    ["M", "Glacier", "Chase", "Ropes"], #333
    ["Swanky's Bonus Bonanza"], #334
    ["Barter's Swap Shop"], #335
    ["Banana Bird"], #336
    ["ANY Bonus"], #337
    ["Lose a Life"], #338
    #Razor Ridge
    ["M", "Barrel Cannons", "Enguarde", "Caves"], #339
    ["M", "Boss", "Squawks", "Ellie"], #340
    ["Swanky's Bonus Bonanza"], #341
    ["Cranky's Cabin"], #342
    ["M", "Caves", "Ropes", "Water"], #343
    ["DKC3 Bonus"], #344
    ["Banana Bird"], #345
    ["M", "Cliffs", "Fire", "Water"], #346
    ["Candy's Save Point"], #347
    ["M", "Barrels", "Enguarde", "Squitter"], #348
    ["DKC3 Bonus"], #349
    ["Bjorn's Chairlift"], #350
    ["M", "Cliffs", "Gauntlet", "Lights"], #351
    ["M", "Coral Reef", "Rising Danger", "Parry"], #352
    ["Banana Bird"], #353
    ["M", "Waterfall", "Gauntlet", "Water"], #354
    ["M", "Ropes", "Quawks", "Water"], #355
    #Pacifica
    ["M", "Gauntlet", "Ropes", "Water"], #356
    ["Cranky's Cabin"], #357
    ["Crystal Coconut"], #358
    ["M", "Coral Reef", "Barrel Cannons", "Spawners"], #359
    ["M", "Trees", "Enguarde", "Water"], #360
    ["Banana Bird"], #361
    ["M", "Docks", "Hooks", "Water"], #362
    ["Barnacle's Island"], #363
    ["M", "Coral Reef", "Boss", "Storm"], #364
    ["Lose a Life"], #365
    ["DKC3 Bonus"], #366
    ["Banana Bird"], #367
    ["M", "Pipes", "Ropes", "Water"], #368
    ["M", "Carts", "Spawners", "Water"], #369
    ["DKC3 Bonus"], #370
    ["M", "Pipes", "Gauntlet", "Wind"], #371
    ["Banana Bird"], #372
    ["Swanky's Bonus Bonanza"], #373
    ["M", "Cliffs", "Gauntlet", "Enguarde"], #374
    ["ANY Bonus"], #375
    #KAOS Kore
    ["Funky's Flights"], #376
    ["M", "River", "Gauntlet", "Poison"], #377
    ["M", "Conveyors", "Storm", "Water"], #378
    ["Baffle's Code Room"], #379
    ["Lose a Life"], #380
    ["Cranky's Cabin"], #381
    ["Banana Bird"], #382
    ["DKC3 Bonus"], #383
    ["M", "Jungle", "Ropes", "Squitter"], #384
    ["Swanky's Bonus Bonanza"], #385
    ["M", "Caves", "Barrels", "Water"], #386
    ["DKC3 Bonus"], #387
    ["M", "Castle", "Barrel Cannons", "Gauntlet"], #388
    ["M", "Enguarde", "Barrels", "Boss"], #389
    ["Banana Bird"], #390
    ["M", "Jungle", "Fire", "Ghosts"], #391
    ["M", "Pipes", "Boss", "Hooks"], #392
    #Krematoa
    ["M", "Barrels", "Fire", "Squitter"], #393
    ["Candy's Save Point"], #394
    ["M", "Trees", "Drums", "Gauntlet"], #395
    ["M", "Caves", "Boss", "Squawks"], #396
    ["Lose a Life"], #397
    ["DKC3 Bonus"], #398
    ["M", "Jungle", "Conveyors", "Spawners"], #399
    ["Wrinkly's Kong Kollege"], #400
    ["M", "Ellie", "Parry", "Squawks"], #401
    ["Banana Bird"], #402
    ["ANY Bonus"], #403
    ["M", "Jungle", "Cliffs", "Barrels"], #404
    ["Boomer's Bomb Shelter"], #405
    ["Swanky's Bonus Bonanza"], #406
    ["M", "Cliffs", "Fire", "Water"], #407
    ["Cranky's Cabin"], #408
    ["M", "Ropes", "Ship Hold", "Squitter"] #409
    ]
money_brackets = [
    # $50
    [1, 2, 3, 4, 5, 6, 41, 42, 43, 44, 45, 46, 88, 89, 90, 91 ,92, 93],
    # $100
    [7, 8, 9, 10, 11, 12, 47, 48, 49, 50, 51, 52, 94, 95, 96, 97, 98, 99],
    # $150
    [13, 14, 15, 16, 17, 18, 19, 53, 54, 55, 56, 57, 58, 59, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111],
    # $200
    [20, 21, 22, 23, 24, 25, 26, 60, 61, 62, 63, 64, 65, 66, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123],
    # $250
    [27, 28, 29, 30, 31, 32, 33, 67, 68, 69, 70, 71, 72, 124, 125, 126, 127, 128, 129, 130],
    # $300
    [34, 35, 36, 37, 38, 39, 40, 73, 74, 75, 76, 77, 78, 79, 80, 81, 131, 132, 133, 134, 135, 136],
    # $350
    [82, 83, 84, 85, 86, 87, 137, 138, 139, 140, 141, 142]
    ]
level_list = [
    #Kongo Jungle
    ["Jungle Hijinxs"], #1
    ["Ropey Rampage"], #2
    ["Reptile Rumble"], #3
    ["Coral Capers"], #4
    ["Barrel Cannon Canyon"], #5
    ["Very Gnawty's Lair"], #6
    #Monkey Mines
    ["Winky's Walkway"], #7
    ["Mine Cart Carnage"], #8
    ["Bouncy Bonanza"], #9
    ["Stop & Go Station"], #10
    ["Millstone Mayhem"], #11
    ["Necky's Nuts"], #12
    #Vine Valley
    ["Vulture Culture"], #13
    ["Tree Top Town"], #14
    ["Forest Frenzy"], #15
    ["Orang-Utan Gang"], #16
    ["Clam City"], #17
    ["Temple Tempest"], #18
    ["Bumble B. Rumble"], #19
    #Gorilla Glacier
    ["Snow Barrel Blast"], #20
    ["Slipslide Ride"], #21
    ["Croctopus Chase"], #22
    ["Ice Age Alley"], #23
    ["Rope Bridge Rumble"], #24
    ["Torchlight Trouble"], #25
    ["Really Gnawty Rampage"], #26
    #Kremkroc Industries Inc.
    ["Oil Drum Alley"], #27
    ["Trick Track Trek"], #28
    ["Poison Pond"], #29
    ["Elevator Antics"], #30
    ["Blackout Basement"], #31
    ["Mine Cart Madness"], #32
    ["Boss Dumb Drum"], #33
    #Chimp Caverns
    ["Tanked Up Trouble"], #34
    ["Manic Mincers"], #35
    ["Misty Mine"], #36
    ["Loopy Lights"], #37
    ["Platform Perils"], #38
    ["Necky's Revenge"], #39
    ["Gang-Plank Galleon"], #40
    #Gangplank Galleon
    ["Pirate Panic"], #41
    ["Mainbrace Mayhem"], #42
    ["Gangplank Galley"], #43
    ["Lockjaw's Locker"], #44
    ["Topsail Trouble"], #45
    ["Krow's Nest"], #46
    #Crocodile Cauldron
    ["Hot-Head Hop"], #47
    ["Kannon's Klaim"], #48
    ["Lava Lagoon"], #49
    ["Red-Hot Ride"], #50
    ["Squawks's Shaft"], #51
    ["Kleever's Kiln"], #52
    #Krem Quay
    ["Barrel Bayou"], #53
    ["Glimmer's Galleon"], #54
    ["Krockhead Klamber"], #55
    ["Rattle Battle"], #56
    ["Slime Climb"], #57
    ["Bramble Blast"], #58
    ["Kudgel's Kontest"], #59
    #Krazy Kremland
    ["Hornet Hole"], #60
    ["Target Terror"], #61
    ["Bramble Scramble"], #62
    ["Rickety Race"], #63
    ["Mudhole Marsh"], #64
    ["Rambi Rumble"], #65
    ["King Zing Sting"], #66
    #Gloomy Gultch
    ["Ghostly Grove"], #67
    ["Haunted Hall"], #68
    ["Gusty Glade"], #69
    ["Parrot Chute Panic"], #70
    ["Web Woods"], #71
    ["Kreepy Krow"], #72
    #K. Rool's Keep
    ["Arctic Abyss"], #73
    ["Castle Crush"], #74
    ["Clapper's Cavern"], #75
    ["Windy Well"], #76
    ["Chain Link Chamber"], #77
    ["Toxic Tower"], #78
    ["Stronghold Showdown"], #79
    #The Flying Krock
    ["Screech's Sprint"], #80
    ["K. Rool Duel"], #81
    #The Lost World
    ["Jungle Jinx"], #82
    ["Black Ice Battle"], #83
    ["Klobber Karnage"], #84
    ["Fiery Furnace"], #85
    ["Animal Antics"], #86
    ["Krocodile Kore"], #87
    #Lake Orangatanga
    ["Lakeside Limbo"], #88
    ["Doorstop Dash"], #89
    ["Tidal Trouble"], #90
    ["Skidda's Row"], #91
    ["Murky Mill"], #92
    ["Belcha's Barn"], #93
    #Kremwood Forest
    ["Springin' Spiders"], #94
    ["Riverside Race"], #95
    ["Squeals on Wheels"], #96
    ["Barrel Shield Bust-Up"], #97
    ["Bobbing Barrel Brawl"], #98
    ["Arich's Ambush"], #99
    #Cotton-Top Cove
    ["Bazza's Blockade"], #100
    ["Rocket Barrel Ride"], #101
    ["Kreeping Klasps"], #102
    ["Tracker Barrel Trek"], #103
    ["Fish Food Frenzy"], #104
    ["Squirt's Showdown"], #105
    #Mekanos
    ["Fire-Ball Frenzy"], #106
    ["Demolition Drain-Pipe"], #107
    ["Ripsaw Rage"], #108
    ["Blazing Bazukas"], #109
    ["Low-G Labyrinth"], #110
    ["KAOS Karnage"], #111
    #K3
    ["Krevice Kreepers"], #112
    ["Tearaway Toboggan"], #113
    ["Barrel Drop Bounce"], #114
    ["Krack-Shot Kroc"], #115
    ["Lemguin Lunge"], #116
    ["Bleak's House"], #117
    #Razor Ridge
    ["Buzzer Barrage"], #118
    ["Kong-Fused Cliffs"], #119
    ["Floodlit Fish"], #120
    ["Pot Hole Panic"], #121
    ["Ropey Rumpus"], #122
    ["Kroctopus Krush"], #123
    #Pacifica
    ["Dingy Drain-Pipe"], #124
    ["Stormy Seas"], #125
    ["Sunken Spruce"], #126
    ["Cliffside Blast"], #127
    ["Ripcurl Reef"], #128
    ["Surf's Up"], #129
    ["Barbos's Barrier"], #130
    #KAOS Kore
    ["Konveyor Rope-Klash"], #131
    ["Creepy Caverns"], #132
    ["Lighting Look-Out"], #133
    ["Koindozer Klamber"], #134
    ["Poisonous Pipeline"], #135
    ["Kastle KAOS"], #136
    #Krematoa
    ["Stampede Sprint"], #137
    ["Criss Kross Cliffs"], #138
    ["Tyrant Twin Tussle"], #139
    ["Swoopy Salvo"], #140
    ["Rocket Rush"], #141
    ["Knautilus"] #142
    ]
bonus_difficulties = [
    #Kongo Jungle
    2, #Jungle Hijinxs
    3, #Ropey Rampage
    4, #Reptile Rumble
    1, #Coral Capers
    5, #Barrel Cannon Canyon
    1, #Very Gnawty's Lair
    # Monkey Mines
    2, #Winky's Walkway
    1, #Mine Cart Carnage
    4, #Bouncy Bonanza
    4, #Stop & Go Station
    5, #Millstone Mayhem
    2, #Necky's Nuts
    #Vine Valley
    4, #Vulture Culture
    3, #Tree Top Town
    5, #Forest Frenzy
    7, #Orang-Utan Gang
    1, #Clam City
    5, #Temple Tempest
    4, #Bumble B. Rumble
    #Gorilla Glacier
    6, #Snow Barrel Blast
    5, #Sliplide Ride
    1, #Croctopus Chase
    6, #Ice Age Alley
    4, #Rope Bridge Rumble
    4, #Torchlight Trouble
    2, #Really Gnawty Rampage
    #Kremkroc Industries Inc.
    7, #Oil Drum Alley
    3, #Trick Track Trek
    1, #Poison Pond
    5, #Elevator Antics
    4, #Blackout Basement
    3, #Mine Cart Madness
    2, #Boss Dumb Drum
    #Chimp Caverns / Gang-Plank Galleon
    4, #Tanked Up Trouble
    4, #Manic Mincers
    6, #Misty Mine
    4, #Loopy Lights
    3, #Platform Perils
    3, #Necky's Revenge
    5, #Gang-Plank Galleon
    #Gangplank Galleon
    3, #Pirate Panic
    4, #Mainbrace Mayhem
    3, #Gangplank Galley
    3, #Lockjaw's Locker
    3, #Topsail Trouble
    2, #Krow's Nes
    #Crocodile Cauldron
    4, #Hot-Head Hop
    5, #Kannon's Klaim
    4, #Lava Lagoon
    4, #Red-Hot Ride
    5, #Squawks's Shaft
    4, #Kleever's Kiln
    #Krem Quay
    6, #Barrel Bayou
    5, #Glimmer's Galleon
    3, #Krockhead Klamber
    5, #Rattle Battle
    4, #Slime Climb
    5, #Bramble Blast
    3, #Kudgel's Kontest
    #Krazy Kremland
    4, #Hornet Hole
    4, #Target Terror
    7, #Bramble Scramble
    4, #Rickety Race
    5, #Mudhole Marsh
    5, #Rambi Rumble
    5, #King Zing Sting
    #Gloomy Gulch
    5, #Ghostly Grove
    4, #Haunted Hall
    3, #Gusty Glade
    4, #Parrot Chute Panic
    7, #Web Woods
    4, #Kreepy Krow
    #K. Rool's Keep
    4, #Arctic Abyss
    4, #Castle Crush
    4, #Clapper's Cavern
    3, #Windy Well
    6, #Chain Link Chamber
    4, #Toxic Tower
    4, #Stronghold Showdown
    #The Flying Krock
    4, #Screech's Sprint
    6, #K. Rool Duel
    #Lost World
    5, #Jungle Jinx
    4, #Black Ice Battle
    4, #Klobber Karnage
    3, #Fiery Furnace
    4, #Animal Antics
    6, #Krocodile Kore
    #Lake Orangatanga
    3, #Lakeside Limbo
    3, #Doorstop Dash
    3, #Tidal Trouble
    2, #Skidda's Row
    4, #Murky Mill
    2, #Belcha's Barn
    #Kremwood Forest
    4, #Springin' Spiders
    5, #Riverside Race
    3, #Squeals on Wheels
    3, #Barrel Shield Bust-Up
    3, #Bobbing Barrel Brawl
    2, #Arich's Ambush
    #Cotton-Top Cove
    3, #Bazza's Blockade
    3, #Rocket Barrel Ride
    3, #Kreeping Klasps
    3, #Tracker Barrel Trek
    4, #Fish Food Frenzy
    4, #Squirt's Showdown
    #Mekanos
    4, #Fire-Ball Frenzy
    3, #Demolition Drain-Pipe
    2, #Ripsaw Rage
    5, #Blazing Bazukas
    4, #Low-G Labyrinth
    3, #KAOS Karnage
    #K3
    4, #Krevice Kreepers
    3, #Tearaway Toboggan
    5, #Barrel Drop Bounce
    4, #Krack-Shot Kroc
    2, #Lemguin Lunge
    4, #Bleak's House
    #Razor Ridge
    4, #Buzzer Barrage
    3, #Kong-Fused Cliffs
    4, #Floodlit Fish
    4, #Pot Hole Panic
    5, #Ropey Rumpus
    3, #Kroctopus Krush
    #Pacifica
    4, #Dingy Drain-Pipe
    4, #Stormy Seas
    5, #Sunken Spruce
    3, #Cliffside Blast
    4, #Ripcurl Reef
    3, #Surf's Up
    4, #Barbos's Barrier
    #KAOS Kore
    4, #Konveyor Rope Klash
    4, #Creepy Caverns
    3, #Lightning Looks-Out
    4, #Koindozer Klamber
    3, #Poisonous Pipeline
    6, #Kastle KAOS
    #Krematoa
    4, #Stampede Sprint
    3, #Criss Kross Cliffs
    5, #Tyrant Twin Tussle
    5, #Swoopy Salvo
    2, #Rocket Rush
    6, #Knautilus  
    ]
world_key = {
    1:"Kongo Jungle",
    2:"Monkey Mines",
    3:"Vine Valley",
    4:"Gorilla Glacier",
    5:"Kremkroc Industries Inc",
    6:"Chimp Caverns",
    7:"Gangplank Galleon",
    8:"Crocodile Cauldron",
    9:"Krem Quay",
    10:"Krazy Kremland",
    11:"Gloomy Gulch",
    12:"K.Rool's Keep",
    13:"The Flying Krock",
    14:"Lost World",
    15:"Lake Orangatanga",
    16:"Kremwood Forest",
    17:"Cotton-Top Cove",
    18:"Mekanos",
    19:"K3",
    20:"Razor Ridge",
    21:"Pacifica",
    22:"KAOS Kore",
    23:"Krematoa"
    }
material_list = [
    #Kongo Jungle
    ["Jungle", "Balloons", "Banana Hoard", "Rambi"], #Jungle Hijinxs
    ["Jungle", "Ropes", "Storm"], #Ropey Rampage
    ["Caves", "Tires"], #Reptile Rumble
    ["Coral Reef", "Water", "Enguarde"], #Coral Capers
    ["Jungle", "Barrel Cannons"], #Barrel Cannon Canyon
    ["Banana Hoard", "Boss"], #Very Gnawty's Lair
    # Monkey Mines
    ["Scaffolding", "Drums", "Spawners", "Winky"], #Winky's Walkway
    ["Mines", "Carts"], #Mine Cart Carnage
    ["Caves", "Tires", "Winky"], #Bouncy Bonanza
    ["Mines", "Barrels", "Gauntlet", "Lights"], #Stop & Go Station
    ["Temple", "Millstones", "Winky"], #Millstone Mayhem
    ["Banana Hoard", "Boss", "Tires"], #Necky's Nuts
    #Vine Valley
    ["Forest", "Barrel Cannons"], #Vulture Culture
    ["Trees", "Barrel Cannons"], #Tree Top Town
    ["Forest", "Gauntlet", "Ropes"], #Forest Frenzy
    ["Jungle", "Balloons", "Barrels", "Expresso"], #Orang-Utan Gang
    ["Coral Reef", "Gauntlet", "Water", "Enguarde"], #Clam City
    ["Temple", "Chase", "Ropes", "Millstones", "Expresso"], #Temple Tempest
    ["Banana Hoard", "Barrels", "Boss"], #Bumble B. Rumble
    #Gorilla Glacier
    ["Glacier", "Barrel Cannons", "Storm"], #Snow Barrel Blast
    ["Ice Cave", "Conveyors", "Ropes"], #Sliplide Ride
    ["Coral Reef", "Chase", "Water", "Enguarde"], #Croctopus Chase
    ["Glacier", "Ropes", "Storm", "Expresso"], #Ice Age Alley
    ["Trees", "Tires", "Winky"], #Rope Bridge Rumble
    ["Caves", "Drums", "Fire", "Lights", "Mincers", "Squawks"], #Torchlight Trouble
    ["Banana Hoard", "Caves", "Boss"], #Really Gnawty Rampage
    #Kremkroc Industries Inc.
    ["Factory", "Balloons", "Drums", "Fire", "Rambi"], #Oil Drum Alley
    ["Scaffolding", "Conveyors", "Gauntlet"], #Trick Track Trek
    ["Coral Reef", "Gauntlet", "Mincers", "Poison", "Water", "Enguarde"], #Poison Pond
    ["Caves", "Conveyors", "Drums", "Ropes", "Spawners"], #Elevator Antics
    ["Factory", "Conveyors", "Lights"], #Blackout Basement
    ["Scaffolding", "Carts", "Tires"], #Mine Cart Madness
    ["Banana Hoard", "Boss", "Drums", "Spawners"], #Boss Dumb Drum
    #Chimp Caverns / Gang-Plank Galleon
    ["Scaffolding", "Conveyors", "Drums"], #Tanked Up Trouble
    ["Caves", "Mincers", "Rambi"], #Manic Mincers
    ["Mines", "Drums", "Ropes", "Spawners", "Expresso"], #Misty Mine
    ["Mines", "Barrels", "Lights"], #Loopy Lights
    ["Scaffolding", "Barrels", "Conveyors"], #Platform Perils
    ["Banana Hoard", "Boss", "Boss", "Tires"], #Necky's Revenge
    ["Ship Deck", "Boss", "Gauntlet"], #Gang-Plank Galleon
    #Gangplank Galleon
    ["Ship Deck", "Doors", "Rambi"], #Pirate Panic
    ["Rigging", "Ropes"], #Mainbrace Mayhem
    ["Ship Deck", "Hooks"], #Gangplank Galley
    ["Ship Hold", "Water", "Enguarde"], #Lockjaw's Locker
    ["Rigging", "Hooks", "Ropes", "Storm", "Rattly"], #Topsail Trouble
    ["Rigging", "Boss"], #Krow's Nes
    #Crocodile Cauldron
    ["Volcano", "Krockheads", "Squitter"], #Hot-Head Hop
    ["Mines", "Barrel Cannons", "Barrels"], #Kannon's Klaim
    ["Ship Hold", "Fire", "Water", "Clapper", "Enguarde"], #Lava Lagoon
    ["Volcano", "Balloons", "Wind", "Rambi"], #Red-Hot Ride
    ["Mines", "Barrel Cannons", "Gauntlet", "Squawks"], #Squawks's Shaft
    ["Volcano", "Boss", "Fire", "Hooks"], #Kleever's Kiln
    #Krem Quay
    ["Swamp", "Barrel Cannons", "Barrels", "Rambi"], #Barrel Bayou
    ["Ship Hold", "Gauntlet", "Lights", "Water", "Glimmer"], #Glimmer's Galleon
    ["Swamp", "Barrels", "Krockheads", "Ropes", "Squitter"], #Krockhead Klamber
    ["Ship Deck", "Gauntlet", "Rattly"], #Rattle Battle
    ["Rigging", "Chase", "Rising Danger", "Ropes", "Water"], #Slime Climb
    ["Brambles", "Barrel Cannons", "Squawks"], #Bramble Blast
    ["Swamp", "Barrels", "Boss"], #Kudgel's Kontest
    #Krazy Kremland
    ["Beehive", "Hooks", "Squitter"], #Hornet Hole
    ["Theme Park", "Barrels", "Carts", "Doors", "Squawks"], #Target Terror
    ["Brambles", "Gauntlet", "Ropes", "Squawks", "Squitter"], #Bramble Scramble
    ["Theme Park", "Carts", "Chase"], #Rickety Race
    ["Swamp", "Gauntlet", "Hooks", "Krockheads"], #Mudhole Marsh
    ["Beehive", "Chase", "Hooks", "Rambi"], #Rambi Rumble
    ["Beehive", "Boss", "Gauntlet", "Squawks"], #King Zing Sting
    #Gloomy Gulch
    ["Forest", "Ghosts", "Ropes"], #Ghostly Grove
    ["Library", "Barrels", "Carts", "Chase", "Doors", "Ghosts"], #Haunted Hall
    ["Forest", "Wind", "Rattly"], #Gusty Glade
    ["Beehive", "Gauntlet", "Quawks", "Squawks"], #Parrot Chute Panic
    ["Forest", "Gauntlet", "Squitter"], #Web Woods
    ["Rigging", "Boss", "Gauntlet", "Ghosts", "Ropes", "Storm"], #Kreepy Krow
    #K. Rool's Keep
    ["Ice Cave", "Gauntlet", "Water", "Enguarde"], #Arctic Abyss
    ["Castle", "Gauntlet", "Rising Danger", "Rambi", "Squawks"], #Castle Crush
    ["Ice Cave", "Chase", "Water", "Clapper", "Enguarde"], #Clapper's Cavern
    ["Mines", "Gauntlet", "Hooks", "Wind", "Squawks"], #Windy Well
    ["Castle", "Barrel Cannons", "Gauntlet", "Hooks", "Ropes"], #Chain Link Chamber
    ["Castle", "Poison", "Rising Danger", "Rattly", "Squawks", "Squitter"], #Toxic Tower
    ["Castle", "Boss", "Fire", "Krockheads"], #Stronghold Showdown
    #The Flying Krock
    ["Brambles", "Chase", "Gauntlet", "Squawks"], #Screech's Sprint
    ["Gunship", "Boss", "Gauntlet", "Poison", "Wind"], #K. Rool Duel
    #Lost World
    ["Jungle", "Spawners", "Tires"], #Jungle Jinx
    ["Ice Cave", "Gauntlet"], #Black Ice Battle
    ["Jungle", "Barrel Cannons", "Barrels"], #Klobber Karnage
    ["Volcano", "Barrel Cannons"], #Fiery Furnace
    ["Jungle", "Ice Cave", "Brambles", "Gauntlet", "Water", "Wind", "Rambi", "Enguarde", "Squitter", "Squawks", "Rattly"], #Animal Antics
    ["Temple", "Volcano", "Boss", "Gauntlet", "Poison"], #Krocodile Kore
    #Lake Orangatanga
    ["Docks", "Balloons", "Water", "Ellie"], #Lakeside Limbo
    ["Barn", "Doors", "Hooks"], #Doorstop Dash
    ["Docks", "Water", "Enguarde"], #Tidal Trouble
    ["Glacier", "Storm"], #Skidda's Row
    ["Barn", "Barrels", "Lights", "Ellie"], #Murky Mill
    ["Barn", "Barrels", "Boss", "Mincers", "Spawners"], #Belcha's Barn
    #Kremwood Forest
    ["Trees", "Conveyors", "Squawks"], #Springin' Spiders
    ["River", "Water", "Chase"], #Riverside Race
    ["Barn", "Barrels", "Doors", "Millstones", "Parry"], #Squeals on Wheels
    ["Trees", "Barrels", "Gauntlet", "Ropes"], #Barrel Shield Bust-Up
    ["River", "Barrels", "Chase", "Water", "Ellie"], #Bobbing Barrel Brawl
    ["Trees", "Barrels", "Boss"], #Arich's Ambush
    #Cotton-Top Cove
    ["Coral Reef", "Spawners", "Water", "Enguarde"], #Bazza's Blockade
    ["Waterfall", "Barrel Cannons", "Parry"], #Rocket Barrel Ride
    ["Docks", "Chase", "Gauntlet", "Ropes", "Water"], #Kreeping Klasps
    ["Waterfall", "Barrel Cannons", "Water", "Parry"], #Tracker Barrel Trek
    ["Coral Reef", "Chase", "Water"], #Fish Food Frenzy
    ["Waterfall", "Boss", "Water", "Wind", "Ellie"], #Squirt's Showdown
    #Mekanos
    ["Factory", "Fire", "Gauntlet", "Ropes", "Squitter"], #Fire-Ball Frenzy
    ["Pipes", "Carts", "Gauntlet", "Hooks"], #Demolition Drain-Pipe
    ["Trees", "Rising Danger"], #Ripsaw Rage
    ["Factory", "Barrel Cannons", "Barrels", "Ropes", "Squitter"], #Blazing Bazukas
    ["Pipes", "Barrels", "Poison", "Quawks", "Squawks"], #Low-G Labyrinth
    ["Factory", "Boss", "Fire"], #KAOS Karnage
    #K3
    ["Cliffs", "Gauntlet", "Ropes"], #Krevice Kreepers
    ["Glacier", "Carts", "Storm"], #Tearaway Toboggan
    ["Waterfall", "Barrels", "Parry"], #Barrel Drop Bounce
    ["Factory", "Chase", "Fire", "Squitter"], #Krack-Shot Kroc
    ["Glacier", "Spawners", "Storm"], #Lemguin Lunge
    ["Glacier", "Boss", "Gauntlet"], #Bleak's House
    #Razor Ridge
    ["Caves", "Barrels", "Gauntlet", "Quawks"], #Buzzer Barrage
    ["Cliffs", "Barrel Cannons", "Fire", "Rising Danger", "Ropes"], #Kong-Fused Cliffs
    ["Coral Reef", "Lights", "Water", "Enguarde"], #Floodlit Fish
    ["Caves", "Gauntlet", "Water", "Squawks", "Enguarde", "Ellie", "Squitter"], #Pot Hole Panic
    ["Cliffs", "Ropes", "Parry"], #Ropey Rumpus
    ["Waterfall", "Boss", "Fire", "Water"], #Kroctopus Krush
    #Pacifica
    ["Pipes", "Gauntlet", "Water", "Enguarde"], #Dingy Drain-Pipe
    ["Docks", "Ropes", "Storm", "Water", "Enguarde"], #Stormy Seas
    ["Trees", "Spawners", "Water"], #Sunken Spruce
    ["Cliffs", "Barrel Cannons", "Ropes"], #Cliffside Blast
    ["Coral Reef", "Spawners", "Water", "Wind"], #Ripcurl Reef
    ["Pipes", "Carts", "Gauntlet", "Hooks", "Water"], #Surf's Up
    ["Coral Reef", "Boss", "Gauntlet", "Water", "Enguarde"], #Barbos's Barrier
    #KAOS Kore
    ["Jungle", "Conveyors", "Ropes"], #Konveyor Rope Klash
    ["Caves", "Barrel Cannons", "Ghosts", "Squitter"], #Creepy Caverns
    ["River", "Barrels", "Storm", "Water"], #Lightning Looks-Out
    ["Jungle", "Gauntlet"], #Koindozer Klamber
    ["Pipes", "Gauntlet", "Poison", "Water", "Enguarde"], #Poisonous Pipeline
    ["Castle", "Barrels", "Boss", "Boss", "Fire", "Hooks"], #Kastle KAOS
    #Krematoa
    ["Jungle", "Gauntlet", "Squawks", "Squitter", "Ellie", "Parry"], #Stampede Sprint
    ["Cliffs", "Barrels", "Ropes"], #Criss Kross Cliffs
    ["Caves", "Gauntlet", "Squitter"], #Tyrant Twin Tussle
    ["Trees", "Spawners", "Squawks"], #Swoopy Salvo
    ["Cliffs", "Drums", "Fire"], #Rocket Rush
    ["Ship Hold", "Barrels", "Boss", "Conveyors", "Fire"], #Knautilus
    
    ]
possible_levels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 
                   71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142]
regular_boss_levels = [6, 12, 19, 26, 33, 39, 46, 52, 59, 66, 72, 79, 93, 99, 105, 111, 117, 123, 130]
final_boss_levels = [40, 81, 87, 136, 142]

def distance(dist, inventory, levels_built, zero_bool):
    #Calculates the levels you are {dist} away from building
    rem_levels = list(set(possible_levels) - set(levels_built))
    in_range = []
    for levels in rem_levels:
        level_mats = material_list[levels - 1]
        req_mats = len(level_mats)
        aqq_mats = 0
        
        if levels != 39 and levels != 136:
            for mats in level_mats:
                if mats in inventory:
                    aqq_mats += 1
            if (req_mats - aqq_mats <= dist):
                r = [levels, req_mats - aqq_mats]
                in_range.append(r)
        else:
            for mats in level_mats:
                if (mats in inventory) and (mats != "Boss"):
                    aqq_mats += 1
            if operator.countOf(inventory,'Boss') == 1:
                aqq_mats += 1
            elif operator.countOf(inventory,'Boss') > 1:
                aqq_mats += 2
            if (req_mats - aqq_mats <= dist):
                r = [levels, req_mats - aqq_mats]
                in_range.append(r)
    i = 0
    while i <= dist:
        print("{:^{width}}".format("{} away".format(i), width=25))
        print("-------------------------\n")
        j=0
        for levels in in_range:
            num = levels[0]
            level_name = level_list[num - 1][0]
            level_mats = material_list[num - 1]
            req_mats = len(level_mats)
            
            if in_range[j][1] == i:
                needed = []
                if num != 39 and num != 136:
                    for mats in level_mats:
                        if mats not in inventory:
                            needed.append(mats)
                else:
                    for mats in level_mats:
                        if (mats not in inventory) and (mats != "Boss"):
                            needed.append(mats)
                        
                    if operator.countOf(inventory,'Boss') == 0:
                        needed.append("Boss")
                        needed.append("Boss")
                    elif operator.countOf(inventory,'Boss') == 1:
                        needed.append("Boss")
                if (num == 82) or (num == 83) or (num == 84) or (num == 85) or (num == 86) or (num == 87) or (num == 137) or (num == 138) or (num == 139) or (num == 140) or (num == 141) or (num == 142):
                    level_name += " (BC) "
                if (zero_bool == False) and ((req_mats - i) == 0):
                    pass
                else:
                    print("{:^{width}} | Have {}/{}, Need - {}\n".format(level_name, (req_mats - i), req_mats, ", ".join(needed), width=25))
                        
            j += 1
        i += 1

    
def fill_inventory(inventory):
    x=0
    y=0
    i=0
    card_count = 0
    material_only = []
    for things in inventory:
        if things in name_list:
            card_count += 1
            material_only.append(things)
    while i < 50:
        if i < card_count:
            cards = material_only[i]
            card_code = "assets/Images/" + cards + ".png"
        else:
            card_code = "assets/Images/Clear.png"
        window.change_rectangle_image(x, y, card_code)
        y+=1
        if (y == 10):
            y = 0
            x+=1
        i+=1

        
def showspace(space, piece_image):
    board_image = Image.open("assets/Board/dim_board.png")
    combined_image = board_image.copy()
    piece_image = Image.open(piece_image)
    piece_image = piece_image.convert("RGBA") 
    x_cor_orig = space_coordinates[space-1][0]
    y_cor_orig = space_coordinates[space-1][1]
    piece_position = (x_cor_orig, y_cor_orig)
    combined_image.paste(piece_image, piece_position, piece_image)
    window.change_main_image(combined_image)        

def main(window):
    try:
        # Open the file for reading and writing
        with open("assets/Test.txt", "r+") as file:
            print("Welcome to the DKC Board Game Helper")
            print("------------------------------")
            print("\nTo win, you must build all the levels in DKC1, 2, and 3; Defeat K. Rool 3 times; and rescue 20 Banana Birds")
            print("To build a level, collect all of the material cards for that level")
            
            window.change_main_image("assets/Board/dim_board.png")
            
            name_test = False
            while (name_test == False):
                
                print("You can be Donkey, Diddy, Dixie, or Kiddy")
                name = input("\nWhat Character Are You Playing As?\n(Type '?' for stats)\n")
                
                
                name = name.lower()
                list_of_characters = ["donkey", "diddy", "dixie", "kiddy"]
                if name in list_of_characters:
                    name_test = True
                elif (name == '?'):
                    print("")
                    print("Donkey Kong (Dice = 10, Inventory = 32, Money from passing Start = $550, Token Inventory = 7)")
                    print("Diddy Kong (Dice = 20, Inventory = 28, Money from passing Start = $325, Token Inventory = 7)")   
                    print("Dixie Kong (Dice = 12, Inventory = 30, Money from passing Start = $475, Token Inventory = 5)")
                    print("Kiddy Kong (Dice = 8, Inventory = 30, Money from passing Start = $700, Token Inventory = 6)") #Pass Go Money Changed from x^2
                    print("")
                    name_test = False
                else:
                    name_test = False
                    print("ERROR: CHARACTER DOES NOT EXIST")
            die = 6
            if name == "donkey":
                die = 10
                char_inv = 32
                pass_go_money = 550
                token_inventory = 7
                picture = "assets/Statics/DK_FULL_TSP.png"
            elif name == "diddy":
                die = 20
                char_inv = 28
                pass_go_money = 325
                token_inventory = 7
                picture = "assets/Statics/DD_TSP.png"
            elif name == "dixie":
                die = 12
                char_inv = 30
                pass_go_money = 475
                token_inventory = 5
                picture = "assets/Statics/DX_TSP.png"
            elif name == "kiddy":
                die = 8
                char_inv = 30
                pass_go_money = 700
                token_inventory = 6
                picture = "assets/Statics/KK_TSP.png"
            #char_inv = 50
            funky_discard = []
            funky_draw = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            current_space = 6
            current_turn = 1
            inventory_lists = []
            built_levels = []   
            banana_birds_remaining = 20
            krool_counter = []
            bonus_checklist = []
            money = 2425
            bonus_coin_count = 0
            token_list = ["Golden Feather", "Camera Piece", "Crystal Coconut", "Banana Bird", "Flipped Bird"]
            built_boss_index = []
            toggles = [["Build Levels", True]]
            # Togleables
            golden_feathers = False
            b1_test = False
            b2_test = False
            b3_test = False
            pass_start = False
            #name = "P1"
            inventory_lists.append([name, []])
            win = False
            exit_program = False
            message = True
            showspace(current_space, picture)
            while (win == False) and (exit_program == False):
                
                print("\nTurn ", current_turn)
                print("----------\n")
                showspace(current_space, picture)
                roll = dice_roll(die)
                keeptrue = True
                if (keeptrue):
                    choice_checker = input("Options: I-Inventory, L-Level's Built, R-Remaining Levels, G-Level Guide, $-Money, T-Trim Inventory, AS-Alphabetically Sort Inventory, TS-Type Sort Inventory, Toggle-Toggle Usables, CL-Closest Levels to Build , C-Use Camera Piece, BB-Banana Birds, BC-Bonus Coins, H-Hidden, E-Exit and Save\n").lower()
                    while(choice_checker != "EXIT" or "PASS"):
                        if (choice_checker == "cl"):
                            card_dist = 0
                            valid_numbs = [1,2,3,4,5,6,7,8,9,10,11]
                            while  ((11 < card_dist) or (card_dist < 1)):
                                card_dist = input("How many Additional Materials Away (1-11)\n")
                                while (card_dist.isnumeric() == False):
                                    print("Invalid Choice\n")
                                    card_dist = input("How many additional materials away (1, 2, 3, 4, 5, or 6)\n")
                                card_dist = int(card_dist)
                                if card_dist not in valid_numbs:
                                    print("\nInvalid Choice\n")
                                else:
                                    zero_ans = input("Include levels that you have 0 of the cards for? (Yes or No)\n".lower())
                                    if zero_ans == "no":
                                        zero_bool = False
                                    else:
                                        zero_bool = True
                                    print("\nLevels that are {} or Less Materials Away\n".format(card_dist))
                            
                            distance(card_dist, inventory_lists[0][1], built_levels, zero_bool)
                        elif (choice_checker == "toggle"):
                            valid = False
                            while valid == False:
                                
                                n=1
                                for toggle in toggles:
                                    tcheck = ""
                                    if toggle[1] == True:
                                        tcheck = "On"
                                    else:
                                        tcheck = "Off"
                                    print("#{} {} {}".format(n, toggle[0], tcheck))
                                    n+=1
                                print("")
                                
                                try:
                                    tselect = int(input("Which option would you like to toggle? 0 for none"))
                                    if tselect == 0:
                                        
                                        break
                                    
                                    if toggles[tselect-1][1] == True:
                                        toggles[tselect-1][1] = False
                                    elif toggles[tselect-1][1] == False:
                                        toggles[tselect-1][1] = True
                                    valid = True
                                except:
                                    print("\nInvalid Option\n")
                                    valid = False
                                
                        elif (choice_checker == "$"):
                            print("")
                            print("You have ${}\n".format(money))   
                            
                        elif (choice_checker == "e"):
                            exit_program = True
                            break
                        elif (choice_checker == "loaded"):
                            roll = int(input("Choose your roll"))
                        elif (choice_checker == "i"):
                            
                            curr_inv = 1
                            for o_cards in (inventory_lists[0][1]):
                                print("#", curr_inv, " ", o_cards)
                                curr_inv += 1
                        elif (choice_checker == "loadsave"):
                            lines = file.readlines()
                            current_turn = int(lines[-9].strip())
                            money = int(lines[-8].strip())
                            inventory_lists[0][1] = lines[-7].strip().split(", ")
                            built_levels = lines[-6].strip().split(", ")
                            curr_lev = 0
                            
                            if (built_levels != [""]):
                                for l in built_levels:
                                    l = int(l)
                                    built_levels[curr_lev] = l
                                    curr_lev += 1
                            else:
                                built_levels = []
                            banana_birds_remaining = int(lines[-5].strip())
                            krool_counter = lines[-4].strip().split(", ")
                            curr_k = 0
                            if (krool_counter != [""]):
                                for l in krool_counter:
                                    l = int(l)
                                    built_levels[curr_k] = l
                                    curr_lev += 1
                            else:
                                krool_counter = []
                            bonus_coin_count = int(lines[-3].strip())
                            built_boss_index = lines[-2].strip().split(", ")
                            curr_b = 0
                            if (built_boss_index != [""]):
                                for l in built_boss_index:
                                    l = int(l)
                                    built_levels[curr_b] = l
                                    curr_lev += 1
                            else:
                                built_boss_index = []
                            current_space = int(lines[-1].strip())
                            fill_inventory(inventory_lists[0][1])
                        
                        elif (choice_checker == "addl"):
                            add = False
                            while (add == False):
                                num = input("Enter Level Number")
                                try:
                                    num = int(num)
                                    if 0 < num < 143:
                                        built_levels.append(num)
                                        add = False
                                except:
                                    add = True
                        elif (choice_checker == "a"):
                            add = False
                            while (add == False):
                                m = input("Enter Material Name, done to finish: ")
                                m = m.lower()
                                m = m.capitalize()
                                
                                if (m == "Done"):
                                    break
                                if m == "Banana hoard":
                                    m = "Banana Hoard"
                                if m == "Coral reef":
                                    m = "Coral Reef"
                                if m == "Ice cave":
                                    m = "Ice Cave"
                                if m == "Ship deck":
                                    m = "Ship Deck"
                                if m == "Ship hold":
                                    m = "Ship Hold"
                                if m == "Theme park":
                                    m = "Theme Park"
                                if m == "Barrel cannons":
                                    m = "Barrel Cannons"
                                if m == "Rising danger":
                                    m = "Rising Danger"
                                if m == "Golden feather":
                                    m = "Golden Feather"
                                if m == "Flipped bird":
                                    m = "Flipped Bird"
                                if m == "Camera piece":
                                    m = "Camera Piece"
                                if m == "Banana bird":
                                    m = "Banana Bird"
                                if m == "Crystal coconut":
                                    m = "Crystal Coconut"
                                real_name = name_check(m)
                                if m in token_list:
                                    inventory_lists[0][1].append(m)
                                elif (real_name == False):
                                    print("Material Name does not Exist\n")
                                
                                else:
                                    inventory_lists[0][1].append(m)
                                fill_inventory(inventory_lists[0][1])
                                
                        elif (choice_checker == "h"):
                            print("")
                            print("Hidden Options: loadsave-Loads Save Data, loaded-Choose your roll, addl-Manually add Levels, A-Add Inventory\n")
                        elif (choice_checker == "bc"):
                            print("\nYou have {} Bonus Coin(s), build some more boss levels to get more\nBonus Coins are required for building levels in the Lost World (82-87), and levels in Krematoa (137-142) (2 per level)\n".format(bonus_coin_count))
                        elif (choice_checker == "bb"):
                            print("\nYou have returned {} Banana Birds so far, you must return {} more to Queen Banana Bird in Cotton-Top Cove\n".format(20-banana_birds_remaining, banana_birds_remaining))
                        elif (choice_checker == 'c'):
                            if ("Camera Piece" not in inventory_lists[0][1]):
                                print("\nYou have no Camera Pieces\n")
                            else:
                                print("")
                                curr_inv = 1
                                for o_cards in (inventory_lists[0][1]):
                                    if (o_cards != "Camera Piece"):
                                        print("#", curr_inv, " ", o_cards)
                                    curr_inv += 1
                                cp = input("\nWhat material would you like to copy (Type the number)")
                                try:
                                    cp = int(cp)
                                    if (inventory_lists[0][1][cp-1] == "Camera Piece"):
                                        print("\nInvalid Option\n")
                                    else:
                                        inventory_lists[0][1].append(inventory_lists[0][1][cp-1])
                                        cp_cnt = 0
                                        for inv in inventory_lists[0][1]:
                                            if inv == "Camera Piece":
                                                inventory_lists[0][1].pop(cp_cnt)
                                                break
                                            cp_cnt += 1
                                        print("")
                                except:
                                    print("\nInvalid Option\n")
                        elif (choice_checker == "t"):
                            print("")
                            trim_check = False
                            while (trim_check == False):
                                curr_inv = 1
                                for o_cards in (inventory_lists[0][1]):
                                    print("#", curr_inv, " ", o_cards)
                                    curr_inv += 1
                                print("")
                                trimmed = input("What card would you like to remove, type 'done' to stop\n").lower()
                                try:
                                    inventory_lists[0][1].pop(int(trimmed)-1)
                                except:
                                    if trimmed == "done":
                                        trim_check = True
                                    else:
                                        print("\nInvalid Choice\n")
                                fill_inventory(inventory_lists[0][1])
                            print("")
                        
                        elif (choice_checker == "l"):
                            print("")
                            for levels in built_levels:
                                print(("#" + str(levels)), level_list[levels-1][0])
                            print("")
                        elif (choice_checker == 'r'):
                            print("")
                            c = 0
                            for levels in level_list:
                                l_test = False
                                for b_levels in built_levels:
                                    if (b_levels - 1) == c:
                                        l_test = True
                                        break
                                if l_test == False:
                                    g_string = " "
                                    print(g_string, ("#" + str(c+1)), levels[0], "|",  ", ".join(material_list[c]))      
                                c += 1
                            print("")
                        elif (choice_checker == "g"):
                            print("")
                            c = 0
                            for levels in level_list:
                                l_test = False
                                for b_levels in built_levels:
                                    if (b_levels - 1) == c:
                                        l_test = True
                                        break
                                if (((c+1 == 82) or (c+1 == 83)or (c+1 == 84)or (c+1 == 85)or (c+1 == 86)or (c+1 == 87)or (c+1 == 137)or (c+1 == 138)or (c+1 == 139)or (c+1 == 140)or (c+1 == 141)or (c+1 == 142)) and (l_test == False)):
                                    g_string = "o"
                                elif l_test == False:
                                    g_string = " "
                                
                                else:
                                    g_string = "X"
                                if c+1 in money_brackets[0]:
                                    price = 50
                                elif c+1 in money_brackets[1]:
                                    price = 100
                                elif c+1 in money_brackets[2]:
                                    price = 150
                                elif c+1 in money_brackets[3]:
                                    price = 200
                                elif c+1 in money_brackets[4]:
                                    price = 250
                                elif c+1 in money_brackets[5]:
                                    price = 300
                                elif c+1 in money_brackets[6]:
                                    price = 350
                                bonus_difficulty = bonus_difficulties[c]
                                if (c+1 in bonus_checklist):
                                    bonus_completion = "!"
                                else:
                                    bonus_completion = " "
                                
                                print(g_string, bonus_completion, ("#" + str(c+1)), levels[0], "|", bonus_difficulty, "|", ", ".join(material_list[c]), "|", "${}".format(price))
                                if ((c+1 == 6) or (c+1 == 12) or (c+1 == 19) or (c+1 == 26) or (c+1 == 33) or (c+1 == 39) or (c+1 == 40) or (c+1 == 46) or (c+1 == 52) or (c+1 == 59) or (c+1 == 66) or (c+1 == 72) or (c+1 == 79) or (c+1 == 81) or (c+1 == 87) or (c+1 == 93) or (c+1 == 99) or (c+1 == 105) or (c+1 == 111) or (c+1 == 117) or (c+1 == 123) or (c+1 == 130) or (c+1 == 136) or (c+1 == 142)):
                                    print("")
                                c += 1
                            
                        elif (choice_checker == 'as'):
                            print("")
                            inventory_lists[0][1].sort()
                            print("Inventory Sorted")
                            print("")
                            fill_inventory(inventory_lists[0][1])
                        elif (choice_checker == "ts"):
                            animals = []
                            enviornments = []
                            resources = []
                            for cards in inventory_lists[0][1]:
                                if cards in animal_list:
                                    animals.append(cards)
                                elif cards in enviornment_list:
                                    enviornments.append(cards)
                                elif cards in resource_list:
                                    resources.append(cards)
                            animals.sort()
                            enviornments.sort()
                            resources.sort()
                            inventory_lists[0][1] = enviornments + resources + animals
                        else:
                            
                            choice_checker = "PASS"
                                    
                        fill_inventory(inventory_lists[0][1])
                        if (choice_checker != "PASS") and (choice_checker != "EXIT"):
                            choice_checker = input("Options: I-Inventory, L-Level's Built, R-Remaining Levels, G-Level Guide, $-Money, T-Trim Inventory, AS-Alphabetically Sort Inventory, TS-Type Sort Inventory, A-Add Inventory, CL-Closest Levels to Build , C-Use Camera Piece, BB-Banana Birds, BC-Bonus Coins, H-Hidden, E-Exit and Save\n").lower()
                        else:
                            break
    
                        
                    level_test = level_check(inventory_lists[0][1], built_levels, bonus_coin_count, money)
                    fill_inventory(inventory_lists[0][1])
                    #level test return a list of numbers that correspond to levels able to be build, it then lists buildable levels then runs the test again.
                    if (len(level_test) != 0) and (toggles[0][1] == True):
                        cont_test = True
                        while (cont_test == True):
                            
                            print("\nBuildable Levels\n")
                            for levels in level_test:
                                print(("#" + str(levels)),level_list[levels-1][0])
                            print("")
                            answer = input("Which level whould you like to build (Enter number of level, or type anything else for no build, Off-Turns this prompt off)\n").lower()
                            try:
                                answer = int(answer)
                                if answer in level_test:
                                    built_levels.append(answer)
                                    
                                    for materials in material_list[answer-1]:
                                        curr_card = 0
                                        for cards in inventory_lists[0][1]:
                                            if materials == cards:
                                                inventory_lists[0][1].pop(curr_card)
                                                break
                                            curr_card += 1
                                    levels = answer
                                    print("\nSuccessfully Built\n")
                                    print("New Inventory\n")
                                    for cards in (inventory_lists[0][1]):
                                        print(cards)
                                    print("")
                                else:
                                    print("Invalid Option")
                                fill_inventory(inventory_lists[0][1])
                                level_test = level_check(inventory_lists[0][1], built_levels, bonus_coin_count, money)
                                fill_inventory(inventory_lists[0][1])
                                if (len(level_test) == 0):
                                    break
                            except:
                                if answer == "off":
                                    cont_test = False
                                    for toggle in toggles:
                                        if toggle[0] == "Build Levels":
                                            if toggle[1] == True:
                                                toggle[1] = False
                                                break
                                break
                    
                if (current_space != 1) and (current_space != 2) and (current_space != 3):
                    print("\nYou rolled a", roll)
                    print("")
                
                    
                if ("Golden Feather" in inventory_lists[0][1]):
                    tfc = False
                    found = False
                    for toggle in toggles:
                        if toggle[0] == "Golden Feather":
                            if toggle[1] == True:
                                tfc = True
                                found = True
                            else:
                                tfc = False
                                found = True
                    if found == False:
                        toggles.append(["Golden Feather", True])
                        tfc = True
                        
                    if tfc == True:
                        gf_use = input("Would you like to use a Golden Feather (Yes to use, anything else for no, Off to toggle GF off)\n").lower()
                        if (gf_use == 'm'):
                            board_image = Image.open("assets/Board/dim_board.png")
                            piece_image = Image.open(picture)
                            piece_image = piece_image.convert("RGBA")
                            x_cor = space_coordinates[current_space - 1][0]
                            y_cor = space_coordinates[current_space - 1][1]
                            piece_position = (x_cor, y_cor)  # Replace with your desired coordinates (x, y)
                            combined_image = board_image.copy()
                            combined_image.paste(piece_image, piece_position, piece_image)
                            window.change_main_image(combined_image)
                            gf_use = input("Would you like to use a Golden Feather (Yes to use, anything else for no)\n").lower()
                        if (gf_use == "off"):
                            for toggle in toggles:
                                if toggle[0] == "Golden Feather":
                                    if toggle[1] == True:
                                        toggle[1] = False
                                        break
                        if (gf_use == "yes"):
                            
                            valid = False
                            while valid == False:
                                gf = input("\nHow would you like to alter your roll (+2, +1, -1, -2) (Type the number 2, 1, -1, -2)")
                                try:
                                    gf = int(gf)
                                    if (gf == 0) or (gf > 2) or (gf < -2):
                                        print("\nInvalid Option\n")
                                        valid = False
                                    else:
                                        roll = roll + gf
                                        gf_cnt = 0
                                        for inv in inventory_lists[0][1]:
                                            if inv == "Golden Feather":
                                                inventory_lists[0][1].pop(gf_cnt)
                                                valid = True
                                                break
                                            gf_cnt += 1
                                        print("")
                                    
                                except:
                                    print("\nInvalid Option\n")
                if (exit_program == True):
                    break
                result = determine_space(current_space, roll, built_levels, krool_counter, banana_birds_remaining, picture)
                current_space, pass_start = result
                showspace(current_space, picture)
                if (pass_start == True) and (current_space !=6) and (current_turn != 1):
                    pass_start = False
                    print("You Passed Go and receive ${}\n".format(pass_go_money))
                    money += pass_go_money
                if (current_space == 5):
                    win = True
                    break
                if (current_space == 4):
                    if (banana_birds_remaining != 0):
                        while (("Banana Bird" or "Flipped Bird") in inventory_lists[0][1]) and (banana_birds_remaining != 0):
                            b_test = input("Would you like to release a Banana Bird (Yes or No)").lower()
                            if (b_test == "yes"):
                                bb_cnt = 0
                                for inv in inventory_lists[0][1]:
                                    if inv == ("Banana Bird" or "Flipped Bird"):
                                        inventory_lists[0][1].pop(bb_cnt)
                                        banana_birds_remaining -= 1
                                        break
                                    bb_cnt += 1
                                print("")
                            else:
                                break
                        
                if (current_space == 6):
                    pass
                    
                if (full_space_guide[current_space-1][0] != "M"):
                    fill_inventory(inventory_lists[0][1])
                    print("You landed on space", current_space, "Which gives you a", full_space_guide[current_space-1][0])
                    print("")
                else:
                    fill_inventory(inventory_lists[0][1])
                    print("You landed on space {}: You receive".format(current_space), "{},".format(full_space_guide[current_space-1][1]),"{}, and {}".format(full_space_guide[current_space-1][2], full_space_guide[current_space-1][3]))
                    print("")
                if (current_space == 1):
                    battle_1_test = False
                    print("\nKing K. Rool Battle")
                    print("-------------------")
                    print("\nRoll a 5 to beat King K. Rool, or a 1 to die")
                    while (battle_1_test == False):
                        
                        
                        input("\nType to roll")
                        k1_roll = random.randint(1, 6)
                        print("\nYou Rolled a",k1_roll)
                        if (k1_roll == 1):
                            print("\nYou Died")
                            break
                        elif (1 < k1_roll < 5):
                            print("\nWhiff")
                            battle_1_test = False
                        elif (k1_roll == 5) or (k1_roll == 6):
                            print("\nYou Killed K. Rool, Congrats")
                            battle_1_test = True
                    if (battle_1_test == True):
                        krool_counter.append(1)
                if (current_space == 2):
                    battle_2_test = False
                    print("\nKaptain K. Rool Battle")
                    print("---------------------------")
                    print("\nRoll a 6 to beat Kaptain K. Rool, or a 1 to die")
                    while (battle_2_test == False):
                        input("\nType to roll")
                        k2_roll = random.randint(1, 6)
                        print("\nYou Rolled a",k2_roll)
                        if (k2_roll == 1):
                            print("\nYou Died")
                            break
                        elif (1 < k2_roll < 6):
                            print("\nWhiff")
                            battle_2_test = False
                        elif (k2_roll == 6):
                            print("\nYou Killed Kaptain K. Rool, Congrats")
                            battle_2_test = True
                    if (battle_2_test == True):
                        krool_counter.append(2)
                if (current_space == 3):
                    battle_3_test = False
                    print("\nBaron K. Roolenstein Battle")
                    print("-------------------------------")
                    print("\nRoll a 6 to beat Baron K. Roolenstein, or a 1 to die")
                    while (battle_3_test == False):

                        input("\nType to roll")
                        k3_roll = random.randint(1, 6)
                        print("\nYou Rolled a",k3_roll)
                        if (k3_roll == 1):
                            print("\nYou Died")
                            break
                        elif (1 < k3_roll < 6):
                            print("\nWhiff")
                            battle_3_test = False
                        elif (k3_roll == 6):
                            print("\nYou Baron K. Roolenstein, Congrats")
                            battle_3_test = True
                    if (battle_3_test == True):
                        krool_counter.append(3)
                if (full_space_guide[current_space-1][0]) == "Camera Piece":
                    print("\nYou got a Camera Piece\n")
                    inventory_lists[0][1].append("Camera Piece")
                elif (full_space_guide[current_space-1][0]) == "Golden Feather":
                    print("\nYou got a Golden Feather\n")
                    inventory_lists[0][1].append("Golden Feather")
                elif (full_space_guide[current_space-1][0]) == "Banana Bird":
                    print("\nYou got a Banana Bird\n")
                    inventory_lists[0][1].append("Banana Bird")
                elif (full_space_guide[current_space-1][0]) == "Crystal Coconut":
                    print("\nYou got a Crystal Coconut\n")
                    inventory_lists[0][1].append("Crystal Coconut")
                    
                elif (full_space_guide[current_space-1][0]) == "Funky's Flights":  
                    print("\nHere are your three world options:")
                    # draw_size = funky_draw.size()
                    # if draw_size == 0:
                    #     funky_draw = funky_discard
                    #     funky_discard = []
                    # options = []
                    # while options.size() < 3:
                    #     cindex = funky_draw.size()
                    #     c = random(1,cindex)
                    #     chose = funky_draw.pop(c-1)
                    #     options.append(chose)
                    #     draw_size = funky_draw.size()
                    #     if draw_size == 0:
                    #         funky_draw = funky_discard
                    #         funky_discard = []
                    # cnt = 1
                    # for op in options:
                    #     world = world_key[op]
                    #     print("#{} {}\n".format(cnt, world))
                    #     cnt+=1
                    # print("You have ${}".format(money))
                    # chosen = input("Would you like to fly? (Type Yes or No)\n").lower()
                    # if chosen is not "no":
                    #     chosen = input("Would you like to warp or land on a space. Type 1 for Warp, 2 for Land, anything else to pass. (Warp is $100, Land is $400)\n")
                    #     if chosen == "1":
                    #         if money >= 100:
                    #             p = False
                    #             while p == False:
                    #                 try:
                    #                     world = int(input("Which world do you want to fly to (1, 2, 3)"))
                    #                     p = True
                    #                     world = options[world-1]
                    #                     money -= 100
                    #                     print("Which space would you like to warp to?/n")
                    #                     for:
                    #                         print("#{} {}".format())
                    #                     l = False
                    #                     while l == False:
                    #                         try:
                    #                             spc = int(input)
                                                
                    #                             l = True
                    #                         except:
                    #                             print("Invalid option\n")
                    #                 except:
                    #                     print("Invalid option\n")
                    #         else:
                    #             print("Not enough money\n")
                    #             break
                    #     elif chosen == "2":
                    #     else:
                    #         break
                        
                        
                
                elif (full_space_guide[current_space-1][0]) == "M":
                    
                    inventory_lists[0][1].append(full_space_guide[current_space-1][1])
                    inventory_lists[0][1].append(full_space_guide[current_space-1][2])
                    inventory_lists[0][1].append(full_space_guide[current_space-1][3])
                    print("Your Inventory is now\n")
                    fill_inventory(inventory_lists[0][1])
                    for cards in (inventory_lists[0][1]):
                        print(cards)
                    print("")
                
                level_test = level_check(inventory_lists[0][1], built_levels, bonus_coin_count, money)
                #level test return a list of numbers that correspond to levels able to be build, it then lists buildable levels then runs the test again.
                if (len(level_test) != 0) and (toggles[0][1] == True):
                    cont_test = True
                    while (cont_test == True):
                        
                        print("\nBuildable Levels\n")
                        for levels in level_test:
                            print(("#" + str(levels)),level_list[levels-1][0])
                        print("")
                        answer = input("Which level whould you like to build (Enter number of level, or type anything else for no build (Typing Off turns off this prompt))\n").lower()
                        try:
                            answer = int(answer)
                            if answer in level_test:
                                built_levels.append(answer)
                                
                                for materials in material_list[answer-1]:
                                    curr_card = 0
                                    for cards in inventory_lists[0][1]:
                                        if materials == cards:
                                            inventory_lists[0][1].pop(curr_card)
                                            break
                                        curr_card += 1
                                levels = answer
                                if (levels == 82) or (levels == 83) or (levels == 84) or (levels == 85) or (levels == 86) or (levels == 87) or (levels == 137) or (levels == 138) or (levels == 139) or (levels == 140) or (levels == 141) or (levels == 142):  
                                    bonus_coin_count -= 2
                                if levels in money_brackets[0]:
                                    money -= 50
                                elif levels in money_brackets[1]:
                                    money -= 100
                                elif levels in money_brackets[2]:
                                    money -= 150
                                elif levels in money_brackets[3]:
                                    money -= 200
                                elif levels in money_brackets[4]:
                                    money -= 250
                                elif levels in money_brackets[5]:
                                    money -= 300
                                elif levels in money_brackets[6]:
                                    money -= 350
                                print("\nSuccessfully Built\n")
                                
                                if (levels not in regular_boss_levels) and (levels not in final_boss_levels):
                                
                                    input("Roll for the Bonus, you need a {} to succeed\n".format(bonus_difficulties[levels-1]))
                                    bonus_roll = dice_roll(6)
                                    if (bonus_roll >= bonus_difficulties[levels-1]):
                                        bonus_check = "Success"
                                        bonus_checklist.append(levels)
                                    else:
                                        if ("Banana Bird" in inventory_lists[0][1]):
                                            bb_ask = input("You failed the bonus roll with a roll of only a {}, would you like to use a Banana Bird to increase your roll by 1 or 2 (Yes or No)".format(bonus_roll)).lower()
                                            if (bb_ask == "yes"):
                                                bonus_roll += 2
                                                for inv in inventory_lists[0][1]:
                                                    if inv == "Banana Bird":
                                                        inventory_lists[0][1].pop(bb_cnt)
                                                        inventory_lists[0][1].append("Flipped Bird")
                                                        break
                                                if (bonus_roll >= bonus_difficulties[levels-1]):
                                                    bonus_check = "Success"
                                                    bonus_checklist.append(levels)
                                                else:
                                                    bonus_check = "Failure"
                                            else:
                                                bonus_check = "Failure"
                                        else:
                                            bonus_check = "Failure"
                                        
                                    print("You rolled a {}, {}!".format(str(bonus_roll), bonus_check))
                                elif (levels in regular_boss_levels):
                                    input("Roll to beat the boss, you need a {} to succeed\n".format(bonus_difficulties[levels-1]))
                                    boss_roll = dice_roll(6)
                                    if (boss_roll >= bonus_difficulties[levels-1]):
                                        bonus_check = "Success"
                                        bonus_checklist.append(levels)
                                    else:
                                        if ("Banana Bird" in inventory_lists[0][1]):
                                            bb_ask = input("You failed the boss roll with a roll of only a {}, would you like to use a Banana Bird to increase your roll by 1 or 2 (Yes or No)".format(bonus_roll)).lower()
                                            if (bb_ask == "yes"):
                                                boss_roll += 2
                                                for inv in inventory_lists[0][1]:
                                                    if inv == "Banana Bird":
                                                        inventory_lists[0][1].pop(bb_cnt)
                                                        inventory_lists[0][1].append("Flipped Bird")
                                                        break
                                                if (boss_roll >= bonus_difficulties[levels-1]):
                                                    bonus_check = "Success"
                                                    bonus_checklist.append(levels)
                                                else:
                                                    bonus_check = "Failure"
                                            else:
                                                bonus_check = "Failure"
                                        else:
                                            bonus_check = "Failure"
                                        
                                    print("You rolled a {}, {}!\n".format(str(boss_roll), bonus_check))
                                    if (bonus_check == "Failure"):
                                        print("You got hurt and must lose 2 slots worth of inventory\n")
                                        curr_dumped = 0
                                        while (curr_dumped < 2):
                                            
                                            curr_inv = 1
                                            
                                            for o_cards in (inventory_lists[0][1]):
                                                print("#", curr_inv, " ", o_cards)
                                                curr_inv += 1
                                            
                                            try:
                                                
                                                if (len(inventory_lists[0][1]) >= 1):
                                                    dumped = input("What would you like to dump (The Number)")
                                                    if (0 < dumped < (len(inventory_lists[0][1]) + 1)):
                                                        
                                                        dumped = int(dumped)
                                                        inventory_lists[0][1].pop(dumped - 1)
                                                        curr_dumped += 1
                                                    else: 
                                                        print("Invalid Option")
                                                else:
                                                    break
                                            except:
                                                print("Invalid Option")
                                print("New Inventory\n")
                                for cards in (inventory_lists[0][1]):
                                    print(cards)
                            else:
                                print("Invalid Option")
                            level_test = level_check(inventory_lists[0][1], built_levels, bonus_coin_count, money)
                            if (len(level_test) == 0):
                                break
                        except:
                            if answer == "off":
                                cont_test = False
                                for toggle in toggles:
                                    if toggle[0] == "Build Levels":
                                        if toggle[1] == True:
                                            toggle[1] = False
                                            break
                                cont_test = False
                            else:
                                cont_test = False
                            #double_check = ""
                            #while (double_check != "pass") and (double_check != "build"):
                                #double_check = input("Are you sure you don't want to build a level (Type Build or Pass)").lower()
                            #if double_check == "pass":
                                #cont_test = False
                            #else:
                                #cont_test = True
                            #print("")
                if (79 in built_levels):
                    if (79 not in built_boss_index):
                        built_boss_index.append(79)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                    if ("Gunship" not in inventory_lists[0][1]):
                        print("\nGunship Added to Inventory for building Stronghold Showdown\n")
                        inventory_lists[0][1].append("Gunship")
                if (6 in built_levels):
                    if (6 not in built_boss_index):
                        built_boss_index.append(6)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (12 in built_levels):
                    if (12 not in built_boss_index):
                        built_boss_index.append(12)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (19 in built_levels):
                    if (19 not in built_boss_index):
                        built_boss_index.append(19)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (26 in built_levels):
                    if (26 not in built_boss_index):
                        built_boss_index.append(26)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (33 in built_levels):
                    if (33 not in built_boss_index):
                        built_boss_index.append(33)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (39 in built_levels):
                    if (39 not in built_boss_index):
                        built_boss_index.append(39)
                        print("\n2 Bonus Coins Added\n")
                        bonus_coin_count += 2
                if (40 in built_levels):
                    if (40 not in built_boss_index):
                        built_boss_index.append(40)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (46 in built_levels):
                    if (46 not in built_boss_index):
                        built_boss_index.append(46)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (52 in built_levels):
                    if (52 not in built_boss_index):
                        built_boss_index.append(52)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (59 in built_levels):
                    if (59 not in built_boss_index):
                        built_boss_index.append(59)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (66 in built_levels):
                    if (66 not in built_boss_index):
                        built_boss_index.append(66)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (72 in built_levels):
                    if (72 not in built_boss_index):
                        built_boss_index.append(72)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (81 in built_levels):
                    if (81 not in built_boss_index):
                        built_boss_index.append(81)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (93 in built_levels):
                    if (93 not in built_boss_index):
                        built_boss_index.append(93)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (99 in built_levels):
                    if (99 not in built_boss_index):
                        built_boss_index.append(99)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (105 in built_levels):
                    if (105 not in built_boss_index):
                        built_boss_index.append(105)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (111 in built_levels):
                    if (111 not in built_boss_index):
                        built_boss_index.append(111)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (117 in built_levels):
                    if (117 not in built_boss_index):
                        built_boss_index.append(117)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (124 in built_levels):
                    if (124 not in built_boss_index):
                        built_boss_index.append(124)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (130 in built_levels):
                    if (130 not in built_boss_index):
                        built_boss_index.append(130)
                        print("\nBonus Coin Added\n")
                        bonus_coin_count += 1
                if (136 in built_levels):
                    if (136 not in built_boss_index):
                        built_boss_index.append(136)
                        print("\n2 Bonus Coins Added\n")
                        bonus_coin_count += 1
                bb_count = operator.countOf(inventory_lists[0][1],'Banana Bird')
                gf_count = operator.countOf(inventory_lists[0][1],'Golden Feather')
                cp_count = operator.countOf(inventory_lists[0][1],'Camera Piece')
                cc_count = operator.countOf(inventory_lists[0][1],'Crystal Coconut')
                token_count = bb_count + gf_count + cc_count + cp_count
                curr_inventory_size = len(inventory_lists[0][1])
                while (token_count > token_inventory):
                    print("You can only have", token_inventory, "tokens in your hand, choose one to discard")
                    print("Your inventory is:")
                    t_test = False
                    curr_card = 1
                    for token in (inventory_lists[0][1]):
                        if (token == "Golden Feather") or (token == "Crystal Coconut") or (token == "Camera Piece") or (token == "Banana Bird"):
                            print("#", curr_card, " ", token)
                        curr_card += 1
                    print("")
                    while (t_test == False):
                        try:
                            choice = int(input("Select which Token to dump(the number of the token)"))
                            if (0 < choice < (curr_inventory_size+1)) and (inventory_lists[0][1][choice-1] in token_list):
                                t_test = True
                            else:
                                print("INVALID CHOICE")
                        except:
                            print("INVALID CHOICE")
                    inventory_lists[0][1].pop(choice-1)
                    token_count -= 1
                    print("")
                curr_inventory_size = len(inventory_lists[0][1])
                while curr_inventory_size > char_inv:
                    print("You can only have", char_inv, "things in your hand, choose one to discard")
                    print("Your inventory is:")
                    curr_card = 1
                    for o_cards in (inventory_lists[0][1]):
                        print("#", curr_card, " ", o_cards)
                        curr_card += 1
                    ch_test = False
                    while (ch_test == False):
                        try:
                            choice = int(input("Select a which card (the number of the card, 0 for remaining levels, 98 for level checklist, 99 to sort)"))
                            if choice == 0:
                                print("")
                                c = 0
                                for levels in level_list:
                                    l_test = False
                                    for b_levels in built_levels:
                                        if (b_levels - 1) == c:
                                            l_test = True
                                            break
                                    if l_test == False:
                                        g_string = " "
                                        print(g_string, ("#" + str(c+1)), levels[0], "|",  ", ".join(material_list[c]))
                                    else:
                                        g_string = "X"
                                    
                                    c += 1
                                print("")
                                fill_inventory(inventory_lists[0][1])
                            elif choice == 98:
                                print("")
                                c = 0
                                for levels in level_list:
                                    l_test = False
                                    for b_levels in built_levels:
                                        if (b_levels - 1) == c:
                                            l_test = True
                                            break
                                    if l_test == False:
                                        g_string = " "
                                    else:
                                        g_string = "X"
                                    print(g_string, ("#" + str(c+1)), levels[0], "|",  ", ".join(material_list[c]))
                                    c += 1
                                print("")
                            elif choice == 99:
                                print("")
                                inventory_lists[0][1].sort()
                                print("Inventory Sorted")
                                fill_inventory(inventory_lists[0][1])
                                print("")
                                curr_card = 1
                                for o_cards in (inventory_lists[0][1]):
                                    print("#", curr_card, " ", o_cards)
                                    curr_card += 1
                                print("")
                            elif 0 < choice < (curr_inventory_size+1):
                                ch_test = True
                            else:
                                print("INVALID CHOICE")
                        except:
                            print("INVALID CHOICE")
                    inventory_lists[0][1].pop(choice-1)
                    curr_inventory_size = len(inventory_lists[0][1])
                    fill_inventory(inventory_lists[0][1])
                if (1 in built_levels) and (2 in built_levels) and (3 in built_levels) and (4 in built_levels) and (5 in built_levels) and (6 in built_levels) and (7 in built_levels) and (8 in built_levels) and (9 in built_levels) and (10 in built_levels) and (11 in built_levels) and (12 in built_levels) and (13 in built_levels) and (14 in built_levels) and (15 in built_levels) and (16 in built_levels) and (17 in built_levels) and (18 in built_levels) and (19 in built_levels) and (20 in built_levels) and (21 in built_levels) and (22 in built_levels) and (23 in built_levels) and (24 in built_levels) and (25 in built_levels) and (26 in built_levels) and (27 in built_levels) and (28 in built_levels) and (29 in built_levels) and (30 in built_levels) and (31 in built_levels) and (32 in built_levels) and (33 in built_levels) and (34 in built_levels) and (35 in built_levels) and (36 in built_levels) and (37 in built_levels) and (38 in built_levels) and (39 in built_levels) and (40 in built_levels):
                    if (b1_test == False):
                        print("\nYou have built all the levels in DKC, Head to King K. Rool in Vine Valley\n")
                        b1_test = True
                if (41 in built_levels) and (42 in built_levels) and (43 in built_levels) and (44 in built_levels) and (45 in built_levels) and (46 in built_levels) and (47 in built_levels) and (48 in built_levels) and (49 in built_levels) and (50 in built_levels) and (51 in built_levels) and (52 in built_levels) and (53 in built_levels) and (54 in built_levels) and (55 in built_levels) and (56 in built_levels) and (57 in built_levels) and (58 in built_levels) and (59 in built_levels) and (60 in built_levels) and (61 in built_levels) and (62 in built_levels) and (63 in built_levels) and (64 in built_levels) and (65 in built_levels) and (66 in built_levels) and (67 in built_levels) and (68 in built_levels) and (69 in built_levels) and (70 in built_levels) and (71 in built_levels) and (72 in built_levels) and (73 in built_levels) and (74 in built_levels) and (75 in built_levels) and (76 in built_levels) and (77 in built_levels) and (78 in built_levels) and (79 in built_levels) and (80 in built_levels) and (81 in built_levels) and (82 in built_levels) and (83 in built_levels) and (84 in built_levels) and (85 in built_levels) and (86 in built_levels) and (87 in built_levels):
                    if (b2_test == False):
                        print("\nYou have built all the levels in DKC2, Head to Kaptain K. Rool in Krem Quay\n")
                        b2_test = True
                if (88 in built_levels) and (89 in built_levels) and (90 in built_levels) and (91 in built_levels) and (92 in built_levels) and (93 in built_levels) and (94 in built_levels) and (95 in built_levels) and (96 in built_levels) and (97 in built_levels) and (98 in built_levels) and (99 in built_levels) and (100 in built_levels) and (101 in built_levels) and (102 in built_levels) and (103 in built_levels) and (104 in built_levels) and (105 in built_levels) and (106 in built_levels) and (107 in built_levels) and (108 in built_levels) and (109 in built_levels) and (110 in built_levels) and (111 in built_levels) and (112 in built_levels) and (113 in built_levels) and (114 in built_levels) and (115 in built_levels) and (116 in built_levels) and (117 in built_levels) and (118 in built_levels) and (119 in built_levels) and (120 in built_levels) and (121 in built_levels) and (122 in built_levels) and (123 in built_levels) and (124 in built_levels) and (125 in built_levels) and (126 in built_levels) and (127 in built_levels) and (128 in built_levels) and (129 in built_levels) and (130 in built_levels) and (131 in built_levels) and (132 in built_levels) and (133 in built_levels) and (134 in built_levels) and (135 in built_levels) and (136 in built_levels) and (137 in built_levels) and (138 in built_levels) and (139 in built_levels) and (140 in built_levels) and (141 in built_levels) and (142 in built_levels):
                    if (b3_test == False):
                        print("\nYou have built all the levels in DKC3, Head to Baron K. Roolenstein in Pacifica\n")
                        b3_test = True
                if (len(built_levels) == 142) and (len(krool_counter) == 3) and (banana_birds_remaining == 0):
                    if (message == True):
                        print("\nYou have built all the levels and beaten K. Rool 3 times, head to the finish space")
                        message = False
                bb_count = operator.countOf(inventory_lists[0][1],'Banana Bird')
                gf_count = operator.countOf(inventory_lists[0][1],'Golden Feather')
                cp_count = operator.countOf(inventory_lists[0][1],'Camera Piece')
                cc_count = operator.countOf(inventory_lists[0][1],'Crystal Coconut')
                money += ((bb_count * 20) + (gf_count * 20) + (cp_count * 20) + (cc_count * 20))
                token_count = bb_count + gf_count + cc_count + cp_count
                if (token_count > 0):
                    print("You earned ${} from your {} token(s) this turn\n".format(((bb_count * 20) + (gf_count * 20) + (cp_count * 20) + (cc_count * 20)), token_count))
                current_turn += 1
                previous_space = current_space
                file.write(str(current_turn))
                file.write("\n")
                file.write(str(money))
                file.write("\n")
                file.write(", ".join(inventory_lists[0][1]))
                file.write("\n")
                my_string_list = [str(item) for item in built_levels]
                file.write(", ".join(my_string_list))
                file.write("\n")
                file.write(str(banana_birds_remaining))
                file.write("\n")
                my_string_list = [str(item) for item in krool_counter]
                file.write(", ".join(my_string_list))
                file.write("\n")
                file.write(str(bonus_coin_count))
                file.write("\n")
                my_string_list = [str(item) for item in built_boss_index]
                file.write(", ".join(my_string_list))
                file.write("\n")
                file.write(str(current_space))
                file.write("\n")
            if (win == True):
                print("\nCONGRATS YOU WIN\n")
            else:
                file.write(str(current_turn))
                file.write("\n")
                file.write(str(money))
                file.write("\n")
                file.write(", ".join(inventory_lists[0][1]))
                file.write("\n")
                my_string_list = [str(item) for item in built_levels]
                file.write(", ".join(my_string_list))
                file.write("\n")
                file.write(str(banana_birds_remaining))
                file.write("\n")
                my_string_list = [str(item) for item in krool_counter]
                file.write(", ".join(my_string_list))
                file.write("\n")
                file.write(str(bonus_coin_count))
                file.write("\n")
                my_string_list = [str(item) for item in built_boss_index]
                file.write(", ".join(my_string_list))
                file.write("\n")
                file.write(str(current_space))
                file.write("\n")
            
    
    except Exception as e:
        error_message = f"An error occurred: {e}\n\nAn error occurred, save data saved in crash reports\n"
        print(error_message) 
        try:
            pass
        except Exception as log_error:
            print(f"Failed to log error to file: {log_error}") 

    finally:
        print("Program execution complete.")

if __name__ == "__main__":
    app = QApplication([])
    window = MainWindow()
    window.show()
    app.exec_()
